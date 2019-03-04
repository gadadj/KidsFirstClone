import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { css } from 'emotion';
import { omit } from 'lodash';
import { memoize } from 'lodash';
import { injectState } from 'freactal';
import AdvancedSqonBuilder from '@arranger/components/dist/AdvancedSqonBuilder';
import ExtendedMappingProvider from '@arranger/components/dist/utils/ExtendedMappingProvider';
import { withApi } from 'services/api';
import { arrangerProjectId } from 'common/injectGlobals';
import { FieldFilterContainer, ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';
import { ModalFooter } from 'components/Modal';
import { Div } from 'uikit/Core';

const extendedMappingToDisplayNameMap = memoize(extendedMapping =>
  extendedMapping.reduce((acc, { field, displayName }) => {
    acc[field] = displayName;
    return acc;
  }, {}),
);

const SqonBuilderContainer = styled('div')`
  > .sqonBuilder .sqonEntry .actionButtonsContainer {
    box-sizing: border-box;
  }
`;

const StyledFieldFilterContainer = styled(FieldFilterContainer)`
  left: auto;
  right: 0px;
`;

const ModalContent = styled(Div)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ClearAllModalContent = ({ onConfirmed }) => (
  <React.Fragment>
    <ModalContent>
      <ModalContent>Are you sure you want to delete all queries?</ModalContent>
      <ModalContent>This action cannot be undone.</ModalContent>
    </ModalContent>
    <ModalFooter submitText="DELETE" handleSubmit={onConfirmed} />
  </React.Fragment>
);

/**
 * this component should mimic the AdvancedSqonBuilder's API directly
 **/

const SqonBuilder = compose(
  withApi,
  injectState,
)(({ api, onChange, state, effects, ...rest }) => {
  const handleAction = async action => {
    if (action.eventKey === 'CLEAR_ALL') {
      effects.setModal({
        title: 'Clear All Queries',
        classNames: {
          modal: css`
            max-width: 500px;
          `,
        },
        component: (
          <ClearAllModalContent
            onConfirmed={() => {
              effects.unsetModal();
              onChange(action);
            }}
          />
        ),
      });
    } else {
      onChange(action);
    }
  };
  return (
    <SqonBuilderContainer>
      <ExtendedMappingProvider
        api={api}
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
        useCache={true}
      >
        {({ loading, extendedMapping }) =>
          loading ? (
            'loading'
          ) : (
            <AdvancedSqonBuilder
              api={api}
              arrangerProjectId={arrangerProjectId}
              arrangerProjectIndex={ARRANGER_API_PARTICIPANT_INDEX_NAME}
              FieldOpModifierContainer={props => (
                <StyledFieldFilterContainer showHeader={false} {...props} />
              )}
              fieldDisplayNameMap={extendedMappingToDisplayNameMap(extendedMapping)}
              onChange={handleAction}
              {...rest}
            />
          )
        }
      </ExtendedMappingProvider>
    </SqonBuilderContainer>
  );
});

SqonBuilder.propTypes = omit(AdvancedSqonBuilder.propTypes, [
  'api',
  'arrangerProjectId',
  'arrangerProjectIndex',
  'getSqonDeleteConfirmation',
  'fieldDisplayNameMap',
]);

export default SqonBuilder;
