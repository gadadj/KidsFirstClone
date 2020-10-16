import React from 'react';
import memoize from 'lodash/memoize';
import AdvancedSqonBuilder from '@kfarranger/components/dist/AdvancedSqonBuilder';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';
import { FieldFilterContainer } from '../FieldFilterContainer';
import { SQONdiff } from '../../Utils';
import { Button, Modal, Spin, Typography } from 'antd';
import { selectModalId } from 'store/selectors/modal';
import { closeModal, openModal } from 'store/actions/modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withApi } from 'services/api';
import './SqonBuilder.css';
import { selectLoggedInUser } from 'store/selectors/users';
import { queryBodySets } from 'services/sets';

const { Paragraph } = Typography;

const trackSQONaction = async ({ category, action, label }) =>
  await trackUserInteraction({ category, action, label: JSON.stringify(label) });

const extendedMappingToDisplayNameMap = memoize((extendedMapping) =>
  extendedMapping.reduce((acc, { field, displayName }) => {
    acc[field] = displayName;
    return acc;
  }, {}),
);

/**
 * this component should mimic the AdvancedSqonBuilder's API directly
 **/

const MODAL_ID = 'CLEAR_ALL_QUERIES_MODAL';

const CLEAR_ALL_EVENT_KEY = 'CLEAR_ALL';

const ACTION_CLEAR_ALL = {
  eventKey: CLEAR_ALL_EVENT_KEY,
  eventDetails: {},
  newSyntheticSqons: [
    {
      op: 'and',
      content: [],
    },
  ],
};

const setQueryVariables = (userId) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: { field: 'userId', value: [userId] },
    },
    {
      op: 'not-in',
      content: { field: 'tag.keyword', value: [''] },
    },
    {
      op: 'in',
      content: { field: 'tag.keyword', value: ['__missing_not_wrapped__'] },
    },
  ],
});

const mapStateToProps = (state) => ({
  openModalId: selectModalId(state),
  loggedInUser: selectLoggedInUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => {
    dispatch(openModal(id));
  },
  closeModal: (id) => {
    dispatch(closeModal(id));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const SqonBuilder = ({
  api,
  onChange,
  openModalId,
  closeModal,
  openModal,
  emptyEntryMessage,
  syntheticSqons,
  onActiveSqonSelect,
  resultCountIconProps,
  sqonDictionary,
  actionsProvider,
  ResultCountIcon,
  activeSqonIndex,
  loggedInUser,
}) => {
  const handleAction = async (action) => {
    await trackSQONaction({
      category: TRACKING_EVENTS.categories.cohortBuilder.sqonBuilder,
      action: `${action.eventKey} - ${Object.keys(action.eventDetails)[0]}`,
      label: {
        [action.eventKey.toLowerCase()]: SQONdiff(syntheticSqons, action.newSyntheticSqons),
        sqon_result: {
          sqon: action.newSyntheticSqons,
          eventDetails: action.eventDetails,
        },
      },
    });

    if (action.eventKey === CLEAR_ALL_EVENT_KEY) {
      openModal(MODAL_ID);
    } else {
      onChange(action);
    }
  };

  const onCloseModal = () => closeModal(MODAL_ID);

  const onClickDeleteQueries = () => {
    onChange(ACTION_CLEAR_ALL);
    closeModal(MODAL_ID);
  };

  return (
    <div className="sqonBuilder-container">
      <Modal
        visible={MODAL_ID === openModalId}
        title={'Clear All Queries'}
        onCancel={onCloseModal}
        footer={[
          <Button key="cancel" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" onClick={onClickDeleteQueries}>
            Delete
          </Button>,
        ]}
      >
        <Paragraph>Are you sure you want to delete all queries?</Paragraph>
        <Paragraph>This action cannot be undone.</Paragraph>
      </Modal>
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading, extendedMapping }) =>
          loading ? (
            <Spin size={'medium'} style={{ margin: '5px' }} />
          ) : (
            <AdvancedSqonBuilder
              api={api}
              arrangerProjectId={arrangerProjectId}
              arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
              FieldOpModifierContainer={(props) => (
                <FieldFilterContainer className="" showHeader={false} {...props} />
              )}
              fieldDisplayNameMap={extendedMappingToDisplayNameMap(extendedMapping)}
              onChange={handleAction}
              syntheticSqons={syntheticSqons}
              emptyEntryMessage={emptyEntryMessage}
              onActiveSqonSelect={onActiveSqonSelect}
              resultCountIconProps={resultCountIconProps}
              sqonDictionary={sqonDictionary}
              actionsProvider={actionsProvider}
              ResultCountIcon={ResultCountIcon}
              activeSqonIndex={activeSqonIndex}
              customQuery={{
                body: queryBodySets('tag setId size'),
                variables: setQueryVariables(loggedInUser.egoId),
                mapResultData: (rawData) =>
                  rawData.sets.hits.edges.map(({ node }) => ({
                    key: `set_id:${node.setId}`,
                    doc_count: node.size,
                  })),
              }}
            />
          )
        }
      </ExtendedMappingProvider>
    </div>
  );
};

SqonBuilder.propTypes = {
  api: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  openModalId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  emptyEntryMessage: PropTypes.string.isRequired,
  syntheticSqons: PropTypes.array.isRequired,
  onActiveSqonSelect: PropTypes.func.isRequired,
  resultCountIconProps: PropTypes.object.isRequired,
  sqonDictionary: PropTypes.array,
  actionsProvider: PropTypes.object,
  ResultCountIcon: PropTypes.any.isRequired,
  activeSqonIndex: PropTypes.number.isRequired,
  loggedInUser: PropTypes.object,
};

const enhanced = compose(withApi, connector);

export default enhanced(SqonBuilder);
