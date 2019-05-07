import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import FieldFilter from '@kfarranger/components/dist/AdvancedSqonBuilder/filterComponents';
import { isReference } from '@kfarranger/components/dist/AdvancedSqonBuilder/utils';
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
import LoadingSpinner from 'uikit/LoadingSpinner';

import { withApi } from 'services/api';
import { arrangerProjectId as ARRANGER_PROJECT_ID } from 'common/injectGlobals';
import { FieldFilterContainer, ARRANGER_API_PARTICIPANT_INDEX_NAME } from '../common';

/**
 * This compoponent also assumes we are only modifying the first level of sqon
 */
const Filter = compose(
  withApi,
  withTheme,
)(
  ({
    api,
    theme,
    initialSqon = {
      op: 'and',
      content: [],
    },
    onSubmit = () => {},
    onCancel = () => {},
    onBack = () => {},
    field,
    arrangerProjectId = ARRANGER_PROJECT_ID,
    arrangerProjectIndex = ARRANGER_API_PARTICIPANT_INDEX_NAME,
  }) => (
    <ExtendedMappingProvider
      api={api}
      projectId={arrangerProjectId}
      graphqlField={arrangerProjectIndex}
      field={field}
      useCache={true}
    >
      {({ extendedMapping, loading }) => {
        if (loading) {
          return (
            <FieldFilterContainer applyEnabled={false} onCancel={onCancel} onBack={onBack}>
              <LoadingSpinner color={theme.greyScale11} size={'30px'} />
            </FieldFilterContainer>
          );
        }
        const { type } = extendedMapping[0] || {}; // assume extendedMapping[0] since `field` is provided to ExtendedMappingProvider.
        const contentWithField = initialSqon.content.find(content => {
          if (!isReference(content)) {
            const {
              content: { field: _field },
            } = content;
            return _field === field;
          } else {
            return false;
          }
        });
        const path = [
          contentWithField
            ? initialSqon.content.indexOf(contentWithField)
            : initialSqon.content.length,
        ];
        const initializedSqon = {
          ...initialSqon,
          content: contentWithField
            ? initialSqon.content
            : [
                ...initialSqon.content,
                {
                  op: ['id', 'keyword', 'boolean'].includes(type) ? 'in' : 'between',
                  content: {
                    field,
                    value: [],
                  },
                },
              ],
        };
        const displayNameMap = (extendedMapping || []).reduce(
          (acc, { field, displayName }) => ({
            ...acc,
            [field]: displayName,
          }),
          {},
        );
        return (
          <FieldFilter
            sqonPath={path}
            initialSqon={initializedSqon}
            onSubmit={onSubmit}
            onCancel={onCancel}
            fieldDisplayNameMap={displayNameMap}
            api={api}
            field={field}
            arrangerProjectId={arrangerProjectId}
            arrangerProjectIndex={arrangerProjectIndex}
            ContainerComponent={props => <FieldFilterContainer {...props} onBack={onBack} />}
          />
        );
      }}
    </ExtendedMappingProvider>
  ),
);

Filter.proptype = {
  initialSqon: PropTypes.shape({
    op: PropTypes.string,
    content: PropTypes.array,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onBack: PropTypes.func,
  field: PropTypes.string.required,
  arrangerProjectId: PropTypes.string,
  arrangerProjectIndex: PropTypes.string,
};

export default Filter;
