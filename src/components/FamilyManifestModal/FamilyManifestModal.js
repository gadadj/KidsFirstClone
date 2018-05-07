import React from 'react';
import { get, difference } from 'lodash';
import Spinner from 'react-spinkit';
import { injectState } from 'freactal';
import { compose, lifecycle, withState } from 'recompose';
import { withFormik } from 'formik';

import DataTypeOption from './DataTypeOption';
import DownloadManifestModal, { DownloadManifestModalFooter } from '../DownloadManifestModal';
import { ModalSubHeader } from '../Modal';
import Query from '@arranger/components/dist/Query';
import { fileManifestParticipantsAndFamily } from '../../services/downloadData';
import { withApi } from 'services/api';
import { generateFamilyManifestModalProps } from './queries';

const sqonForDownload = ({ values, familyMemberIds, sqon }) => {
  const selectedDataTypes = Object.entries(values)
    .filter(([, val]) => val)
    .map(([key]) => key);
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
                content: { field: 'data_type', value: selectedDataTypes },
              },
              {
                op: 'in',
                content: { field: 'participants.kf_id', value: familyMemberIds },
              },
            ],
          },
        ],
      }
    : sqon;
};

export default compose(
  injectState,
  withApi,
  lifecycle({
    componentDidMount() {
      generateFamilyManifestModalProps({
        api: this.props.api,
        sqon: this.props.sqon,
      }).then(x => this.setState(x));
    },
  }),
  withFormik({
    mapPropsToValues: ({ dataTypes }) =>
      (dataTypes || []).reduce((acc, bucket) => ({ ...acc, [bucket.key]: false }), {}),
    handleSubmit: async (
      values,
      {
        props: {
          familyMemberIds,
          sqon,
          columns,
          effects: { unsetModal },
        },
        setSubmitting,
        setErrors,
      },
    ) => {
      fileManifestParticipantsAndFamily({
        sqon: sqonForDownload({ sqon, values, familyMemberIds }),
        columns: columns,
      })().then(async profile => unsetModal(), errors => setSubmitting(false));
    },
  }),
  withState('isDisabled', 'setIsDisabled', false),
)(
  ({
    familyMemberIds,
    participantIds,
    dataTypes,
    sqon,
    index,
    projectId,
    values,
    submitForm,
    isSubmitting,
    isDisabled,
    setIsDisabled,
    api,
  }) => {
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
    return (
      <DownloadManifestModal {...{ sqon, index, projectId, api }}>
        {({ setWarning }) => (
          <div>
            <ModalSubHeader>
              Select the data types you would like to download for the family members:
            </ModalSubHeader>
            {(dataTypes || []).length && (
              <Query
                renderError
                api={api}
                projectId={projectId}
                name={`dataTypeQuery`}
                query={`
                  query dataTypes(${dataTypes.map((dataType, i) => `$sqon${i}: JSON`).join(', ')}) {
                    file {
                      ${dataTypes
                        .map(
                          (dataType, i) => `
                          ${dataType.key.replace(
                            /[^\da-z]/gi,
                            '',
                          )}: aggregations(filters: $sqon${i}) {
                            file_size {
                              stats {
                                sum
                              }
                            }
                          }
                          ${dataType.key.replace(
                            /[^\da-z]/gi,
                            '',
                          )}family: aggregations(filters: $sqon${i}) {
                            participants__family__family_members__kf_id {
                              buckets {
                                key
                              }
                            }
                          }
                        `,
                        )
                        .join('\n')}
                    }
                  }
                `}
                variables={dataTypes.reduce((acc, dataType, i) => {
                  const dataTypeFilters = ids => [
                    {
                      op: 'in',
                      content: { field: 'data_type', value: [dataType.key] },
                    },
                    {
                      op: 'in',
                      content: { field: 'participants.kf_id', value: ids },
                    },
                  ];

                  return {
                    ...acc,
                    [`sqon${i}`]: {
                      op: 'and',
                      content: dataTypeFilters(participantIds),
                    },
                  };
                }, {})}
                render={({ data, loading }) => {
                  return loading
                    ? spinner
                    : (dataTypes || []).map(bucket => {
                        const aggs = get(data, `file`);
                        const familyMemberBuckets = get(
                          aggs,
                          `${bucket.key.replace(
                            /[^\da-z]/gi,
                            '',
                          )}family.participants__family__family_members__kf_id.buckets`,
                        );
                        const familyMembersCount = difference(
                          (familyMemberBuckets && familyMemberBuckets.map(({ key }) => key)) || [],
                          participantIds,
                        ).length;
                        return (
                          <DataTypeOption
                            disabled={isDisabled}
                            key={bucket.key}
                            bucket={bucket}
                            values={values}
                            familyMembers={familyMembersCount}
                            fileSize={get(
                              aggs,
                              `${bucket.key.replace(/[^\da-z]/gi, '')}.file_size.stats.sum`,
                            )}
                          />
                        );
                      });
                }}
              />
            )}
            <DownloadManifestModalFooter
              {...{
                api,
                sqon: sqonForDownload({ sqon, values, familyMemberIds }),
                onManifestGenerated: () => setIsDisabled(true),
                projectId,
                setWarning,
                onDownloadClick: submitForm,
                downloadLoading: isSubmitting,
              }}
            />
          </div>
        )}
      </DownloadManifestModal>
    );
  },
);
