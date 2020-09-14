import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';

import { injectState } from 'freactal';
import saveSet from '@kfarranger/components/dist/utils/saveSet';

import Row from 'uikit/Row';
import { H2 } from 'uikit/Headings';
import { AppstoreFilled, TableOutlined } from '@ant-design/icons';

import DemographicIcon from 'icons/DemographicIcon';
import FilesIcon from 'icons/FilesIcon';
import familyMembers from 'assets/icon-families-grey.svg';

import { Tabs } from 'antd';

import { withApi } from 'services/api';
import graphql from 'services/arranger';

import TableErrorView from './ParticipantsTableView/TableErrorView';
import ParticipantsTableView from './ParticipantsTableView';
import QueriesResolver from './QueriesResolver';
import EmptyCohortOverlay from './EmptyCohortOverlay';
import { createFileRepoLink } from './util';
import Summary from './Summary';

import { Spin, notification } from 'antd';
import ButtonWithRouter from '../../ui/ButtonWithRouter';
import { CARDINALITY_PRECISION_THRESHOLD } from '../../common/constants';
import { roundIntToChosenPowerOfTen } from '../../utils';

import './Results.css';
import { ArrowRightOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const SUMMARY = 'summary';
const TABLE = 'table';
const LABELS = {
  participant: {
    singular: 'participant',
    plural: 'participants',
  },
  family: {
    singular: 'family',
    plural: 'families',
  },
  file: {
    singular: 'file',
    plural: 'files',
  },
};

const formatCountResult = (cardinality, labelKey) => {
  const isZero = cardinality === 0;
  if (isZero) {
    return `No ${capitalize(LABELS[labelKey].singular)}`;
  }

  const hasMany = cardinality > 1;
  const label = hasMany
    ? capitalize(LABELS[labelKey].plural)
    : capitalize(LABELS[labelKey].singular);

  const isApproximation =
    cardinality >= CARDINALITY_PRECISION_THRESHOLD && labelKey !== 'participant';
  if (isApproximation) {
    const approxSymbol = '\u2248';
    return `${approxSymbol} ${roundIntToChosenPowerOfTen(cardinality)} ${label}`;
  }
  return `${cardinality} ${label}`;
};

const showErrorNotification = () =>
  notification.error({
    message: 'Error',
    description: 'Unable to create a link to access file repository',
  });

const generateAllFilesLink = async (user, api, originalSqon) => {
  try {
    const fileSet = await saveSet({
      type: 'participant',
      sqon: originalSqon || {},
      userId: user.egoId,
      path: 'kf_id',
      api: graphql(api),
    });

    const setId = get(fileSet, 'data.saveSet.setId');

    return createFileRepoLink({
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'participants.kf_id',
            value: `set_id:${setId}`,
          },
        },
      ],
    });
  } catch (e) {
    showErrorNotification();
  }
};

const cohortResultsQuery = (sqon) => ({
  query: gql`
        query($sqon: JSON) {
          participant {
            hits(filters: $sqon) {
              total
            }
            aggregations(filters: $sqon, aggregations_filter_themselves: true) {
              files__kf_id {
                cardinality(precision_threshold: ${CARDINALITY_PRECISION_THRESHOLD})
              }
            }
            aggregations(filters: $sqon, aggregations_filter_themselves: true) {
              family_id {
                cardinality(precision_threshold: ${CARDINALITY_PRECISION_THRESHOLD})
              }
            }
          }
        }
      `,
  variables: { sqon },
  transform: (data) => {
    const participantCount = get(data, 'data.participant.hits.total', 0);
    const filesCardinality = data?.data?.participant?.aggregations?.files__kf_id?.cardinality || 0;
    const familiesCountCardinality =
      data?.data?.participant?.aggregations?.family_id?.cardinality || 0;
    return {
      participantCount,
      filesCardinality,
      familiesCountCardinality,
    };
  },
});

const Results = ({ activeSqonIndex, sqon = { op: 'and', content: [] }, api, state }) => (
  <QueriesResolver name={'GQL_RESULT_QUERIES'} api={api} queries={[cohortResultsQuery(sqon)]}>
    {({ isLoading, data, error }) => {
      if (error) {
        return <TableErrorView error={error} />;
      }

      const resultsData = data[0];

      const participantCount = get(resultsData, 'participantCount', null);
      const familiesCount = get(resultsData, 'familiesCountCardinality', null);
      const cohortIsEmpty = (!isLoading && !resultsData) || participantCount === 0;
      const filesCardinality = get(resultsData, 'filesCardinality', 0);

      const hasNoFile = filesCardinality === 0;
      const hasNoCohortQuery = isEmpty(sqon.content);

      const showDetailsHeader = () => (
        <div className="cb-extra-actions-header">
          {hasNoCohortQuery ? (
            <H2>All Data</H2>
          ) : (
            <Fragment>
              <H2>Cohort Results</H2>
              <h3 className="cb-sub-heading" style={{ fontWeight: 'normal', marginRight: '10px' }}>
                for Query {activeSqonIndex + 1}
              </h3>
            </Fragment>
          )}
        </div>
      );

      const extraActions = (
        <div className="cb-extra-actions">
          {showDetailsHeader()}
          {isLoading ? (
            <div className={'cb-summary-is-loading'}>
              <Spin size={'small'} />
            </div>
          ) : (
            <div className="cb-summary">
              <div className="cb-summary-entity">
                <h3 className="cb-sub-heading">
                  <DemographicIcon width="14px" height="17px" />
                  {formatCountResult(participantCount, 'participant')}
                </h3>
              </div>
              <div className="cb-summary-entity">
                <h3 className="cb-sub-heading">
                  <img src={familyMembers} alt="" height="13px" />
                  {formatCountResult(familiesCount, 'family')}
                </h3>
              </div>
              <div className="cb-summary-entity">
                {hasNoFile ? (
                  <h3 className="cb-sub-heading-without-count">
                    <div className="cb-summary-files">
                      <div>
                        <FilesIcon style={{ marginRight: '6px' }} /> {'No File'}
                      </div>
                    </div>
                  </h3>
                ) : (
                  <div>
                    <ButtonWithRouter
                      getLink={
                        hasNoCohortQuery
                          ? () => '/search/file'
                          : () => generateAllFilesLink(state.loggedInUser, api, sqon)
                      }
                    >
                      {formatCountResult(filesCardinality, 'file')}
                      <ArrowRightOutlined />
                    </ButtonWithRouter>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );

      return (
        <Fragment>
          <div style={{ padding: '0 30px 0 34px' }} className="cb-view-links">
            <Tabs
              tabBarExtraContent={extraActions}
              type="card"
              style={{ marginBottom: '0px' }}
              tabBarStyle={{ marginBottom: '0px' }}
            >
              <TabPane
                tab={
                  <span>
                    <AppstoreFilled />
                    Summary View
                  </span>
                }
                key={SUMMARY}
                className="cb-tab-content cb-tab-content-summary"
              >
                <Summary sqon={sqon} />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <TableOutlined />
                    Table View
                  </span>
                }
                key={TABLE}
                className="cb-tab-content"
              >
                {cohortIsEmpty ? <EmptyCohortOverlay /> : null}
                <ParticipantsTableView sqon={sqon} egoGroups={state.egoGroups} />
              </TabPane>
            </Tabs>
          </div>
          <Row className="cb-detail"></Row>
          {}
        </Fragment>
      );
    }}
  </QueriesResolver>
);

Results.propTypes = {
  activeSqonIndex: PropTypes.number.isRequired,
  sqon: PropTypes.object,
  api: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default compose(withApi, injectState)(Results);
