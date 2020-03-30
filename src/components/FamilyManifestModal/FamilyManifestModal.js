import React, { Fragment } from 'react';
import sumBy from 'lodash/sumBy';
import uniq from 'lodash/uniq';
import { injectState } from 'freactal';
import { compose, lifecycle, withState } from 'recompose';
import { withFormik } from 'formik';
import Spinner from 'react-spinkit';
import filesize from 'filesize';
import formatNumber from '@kfarranger/components/dist/utils/formatNumber';
import { ColumnsState } from '@kfarranger/components/dist/DataTable';

import DownloadManifestModal, { DownloadManifestModalFooter } from '../DownloadManifestModal';
import CheckCircleIcon from 'icons/CheckCircleIcon.js';
import { ModalSubHeader } from '../Modal';
import { fileManifestParticipantsAndFamily } from 'services/downloadData';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { generateFamilyManifestModalProps } from './queries';
import FamilyDataTypesStatsQuery from './FamilyDataTypesStatsQuery';
import {
  participantsStatVisual,
  fileStatVisual,
  fileSizeStatVisual,
  familyMembersStatVisual,
} from './statVisuals';

import { H3, TableHeader } from 'uikit/Headings';
import { Paragraph } from 'uikit/Core';

import { flexColumn, flexRow } from 'theme/tempTheme.module.css';
import './FamilyManifestModal.css';

const sqonForDownload = ({ participantIds, fileTypes, sqon }) => {
  return sqon
    ? {
        op: 'or',
        content: [
          sqon,
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'data_type', value: fileTypes },
              },
              {
                op: 'in',
                content: { field: 'participants.kf_id', value: participantIds },
              },
            ],
          },
        ],
      }
    : sqon;
};

const fileSizeToString = fileSize => filesize(fileSize || 0).toUpperCase();

const ManifestTableDataRow = ({
  fileType,
  members,
  files,
  fileSize,
  isChecked,
  showCheckbox,
  leftComponent,
  className = '',
  ...rest
}) => (
  <div className={`row ${isChecked ? 'selected' : ''} ${flexRow} ${className}`} {...rest}>
    <div className={`tableCell ${flexRow}`}>
      {showCheckbox && <input type="checkbox" checked={isChecked} className={`left checkbox`} />}
      {leftComponent && <div className={`left`}>{leftComponent}</div>}
      {fileType}
    </div>
    <div className={`tableCell ${flexRow} dataText`}>{formatNumber(members)}</div>
    <div className={`tableCell ${flexRow} dataText`}>{formatNumber(files)}</div>
    <div className={`tableCell ${flexRow} dataText`}>{fileSize}</div>
  </div>
);

const Table = ({ stats, className = '', children, reverseColor = false }) => (
  <div className={`${flexColumn} ${className} dataTable ${reverseColor ? reverseColor : ''}`}>
    <div className={`row ${flexRow}`}>
      {stats.map(({ label, icon }, i) => (
        <div key={i} className={`tableCell ${flexRow}`}>
          <div className={`left`}>{icon}</div>
          <TableHeader>{label}</TableHeader>
        </div>
      ))}
    </div>
    {children}
  </div>
);

const spinner = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{
      width: 30,
      height: 30,
      margin: 'auto',
      marginBottom: 20,
    }}
  />
);

const Section = ({ children }) => (
  <section style={{ marginTop: '10px', marginBottom: '20px' }}>{children}</section>
);

export default compose(
  injectState,
  withApi,
  lifecycle({
    state: { loading: true },
    componentDidMount() {
      generateFamilyManifestModalProps({
        api: this.props.api,
        sqon: this.props.sqon,
      }).then(x =>
        this.setState({
          ...x,
          loading: false,
        }),
      );
    },
  }),
  withState('setId', 'setSetId', ''),
  withState('isDisabled', 'setIsDisabled', false),
  withState('checkedFileTypes', 'setCheckedFileTypes', []),
)(
  ({
    loading,
    familyMemberIds,
    participantIds,
    dataTypes,
    participantFilesCount,
    participantFilesSize,
    sqon,
    index,
    projectId,
    submitForm,
    isSubmitting,
    isDisabled,
    setIsDisabled,
    checkedFileTypes,
    setCheckedFileTypes,
    api,
    handleSubmit,
    setId,
    setSetId,
    effects: { unsetModal },
  }) => {
    const participantStats = [participantsStatVisual, fileStatVisual, fileSizeStatVisual];
    const familyMemberStats = [familyMembersStatVisual, fileStatVisual, fileSizeStatVisual];
    const participantsMemberCount = (participantIds || []).length;

    const filterToCheckedTypes = data =>
      data.filter(({ fileType }) => checkedFileTypes.includes(fileType));

    const isFamilyMemberFilesAvailable = !!(dataTypes || []).length;

    return (
      <ColumnsState
        projectId={projectId}
        graphqlField="file"
        render={({ state: { columns } }) => (
          <DownloadManifestModal {...{ sqon, index, projectId, api }}>
            {({ setWarning }) => {
              const createFooterComponent = participantIds => {
                const downloadSqon = sqonForDownload({
                  sqon,
                  fileTypes: checkedFileTypes,
                  participantIds,
                });
                return withFormik({
                  handleSubmit: async (value, { setSubmitting, setErrors }) => {
                    fileManifestParticipantsAndFamily({
                      sqon: downloadSqon,
                      columns: columns,
                    })();
                    // track only the file_name column so that we can cross-reference against S3 logs
                    trackUserInteraction({
                      category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                      action: 'Download Manifest ' + TRACKING_EVENTS.actions.click,
                      label: JSON.stringify({
                        sqon: downloadSqon,
                        columns: [
                          {
                            field: 'file_name',
                            accessor: 'file_name',
                            show: true,
                            type: 'string',
                            sortable: true,
                          },
                        ],
                      }),
                    });
                    unsetModal();
                  },
                })(({ handleSubmit }) => (
                  <DownloadManifestModalFooter
                    {...{
                      sqon: downloadSqon,
                      setId,
                      setSetId,
                      api,
                      onManifestGenerated: () => setIsDisabled(true),
                      projectId,
                      setWarning,
                      onDownloadClick: handleSubmit,
                      downloadLoading: isSubmitting,
                    }}
                  />
                ));
              };
              const FooterWithParticipantsOnly = createFooterComponent(participantIds);
              const participantSection = (
                <Section>
                  <ModalSubHeader className={`modalSubHeader`}>
                    <H3 style={{ fontSize: '16px', display: 'inline-block' }}>
                      {'Participants Summary'}
                    </H3>
                    <span>
                      {' '}
                      <Paragraph display="inline-block">
                        {'- all files will be included in the manifest'}
                      </Paragraph>
                    </span>
                  </ModalSubHeader>
                  <Table
                    {...{
                      reverseColor: !isFamilyMemberFilesAvailable,
                      stats: [{ icon: null, label: 'Data Types' }, ...participantStats],
                    }}
                  >
                    <ManifestTableDataRow
                      {...{
                        fileType: 'All',
                        members: participantsMemberCount,
                        files: participantFilesCount,
                        fileSize: fileSizeToString(participantFilesSize),
                        isChecked: isFamilyMemberFilesAvailable,
                        leftComponent: <CheckCircleIcon className={`checkMark`} />,
                      }}
                    />
                  </Table>
                </Section>
              );
              return loading ? (
                spinner
              ) : (
                <div className={`${flexColumn} familyManifestModal`}>
                  {!isFamilyMemberFilesAvailable && participantSection}
                  {isFamilyMemberFilesAvailable ? (
                    <FamilyDataTypesStatsQuery
                      {...{
                        dataTypes,
                        participantIds,
                        projectId,
                        isDisabled,
                        render: ({ loading: loadingFileTypeStats, fileTypeStats }) => {
                          const uniqueParticipantsAndFamilyMemberIds = uniq([
                            ...participantIds,
                            ...(fileTypeStats
                              ? filterToCheckedTypes(fileTypeStats).reduce(
                                  (acc, { familyMembersKeys }) => [...acc, ...familyMembersKeys],
                                  [],
                                )
                              : []),
                          ]);
                          const FooterWithParticipantsAndFamilyMembers = createFooterComponent(
                            uniqueParticipantsAndFamilyMemberIds,
                          );
                          return loadingFileTypeStats ? (
                            spinner
                          ) : (
                            <Fragment>
                              {participantSection}
                              <Section>
                                <ModalSubHeader className={`modalSubHeader`}>
                                  <H3 style={{ fontSize: '16px', display: 'inline-block' }}>
                                    Family Summary
                                  </H3>
                                  <span>
                                    {' '}
                                    <Paragraph display="inline-block">
                                      {
                                        ' - the participants in your query have related family member data.'
                                      }
                                    </Paragraph>
                                  </span>
                                  <div>
                                    {' '}
                                    <Paragraph>
                                      {
                                        ' To include the family data in the manifest, select your desired data types below :  '
                                      }
                                    </Paragraph>
                                  </div>
                                </ModalSubHeader>
                                <Table
                                  {...{
                                    reverseColor: true,
                                    stats: [
                                      { icon: null, label: 'Data Types' },
                                      ...familyMemberStats,
                                    ],
                                  }}
                                >
                                  {fileTypeStats.map(
                                    ({ fileType, members, files, fileSize }, i) => (
                                      <ManifestTableDataRow
                                        {...{
                                          key: i,
                                          showCheckbox: true,
                                          onClick: e => {
                                            setSetId(null);
                                            setCheckedFileTypes(
                                              checkedFileTypes.includes(fileType)
                                                ? checkedFileTypes.filter(type => type !== fileType)
                                                : [...checkedFileTypes, fileType],
                                            );

                                            if (e.target.checked) {
                                              trackUserInteraction({
                                                category:
                                                  TRACKING_EVENTS.categories.fileRepo
                                                    .actionsSidebar,
                                                action:
                                                  TRACKING_EVENTS.actions.download.manifest +
                                                  ' Modal - Data Types - Checked',
                                                label: fileType,
                                              });
                                            }
                                          },
                                          isChecked: checkedFileTypes.includes(fileType),
                                          fileType,
                                          members,
                                          files,
                                          fileSize: fileSizeToString(fileSize),
                                        }}
                                      />
                                    ),
                                  )}
                                </Table>
                              </Section>
                              <Section>
                                <Table
                                  className={`total`}
                                  {...{
                                    stats: [
                                      {
                                        icon: null,
                                        label: 'TOTAL',
                                      },
                                      {
                                        icon: participantsStatVisual.icon,
                                        label: uniqueParticipantsAndFamilyMemberIds.length,
                                      },
                                      {
                                        icon: fileStatVisual.icon,
                                        label:
                                          participantFilesCount +
                                          sumBy(filterToCheckedTypes(fileTypeStats), 'files'),
                                      },
                                      {
                                        icon: fileSizeStatVisual.icon,
                                        label: fileSizeToString(
                                          participantFilesSize +
                                            sumBy(filterToCheckedTypes(fileTypeStats), 'fileSize'),
                                        ),
                                      },
                                    ],
                                  }}
                                />
                              </Section>
                              <FooterWithParticipantsAndFamilyMembers />
                            </Fragment>
                          );
                        },
                      }}
                    />
                  ) : (
                    <FooterWithParticipantsOnly />
                  )}
                </div>
              );
            }}
          </DownloadManifestModal>
        )}
      />
    );
  },
);
