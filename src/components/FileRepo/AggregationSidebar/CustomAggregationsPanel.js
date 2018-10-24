import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import Component from 'react-component-component';

import { AggregationsList } from '@arranger/components/dist/Arranger';
import Query from '@arranger/components/dist/Query';

import { CLINICAL_FILTERS, FILE_FILTERS } from './aggsConfig';
import { withApi } from 'services/api';
import Column from 'uikit/Column';
import QuickSearchBox from './QuickSearchBox';
import { FilterInput } from '../../../uikit/Input';

const ShowIf = ({ condition, children, ...rest }) => (
  /*
    NOTE: this style-based conditional rendering is an optimization strategy to
    prevent re-rendering of AggregationsList which results in extra
    fetching and visual flash
  */
  <div style={{ display: condition ? 'block' : 'none' }} {...rest}>
    {children}
  </div>
);

export default compose(injectState, withTheme, withApi)(
  ({
    api,
    sqon,
    containerRef,
    setSQON = () => {},
    onValueChange = () => {},
    projectId,
    graphqlField,
    translateSQONValue,
    theme,
    state,
    effects,
    selectedTab = 'CLINICAL',
    ...props
  }) => (
    <Query
      renderError
      shouldFetch={true}
      api={api}
      projectId={projectId}
      name={`aggsIntrospection`}
      query={`
        query dataTypes {
          __schema {
            types {
              name
              fields {
                name
                type {
                  name
                }
              }
            }
          }
        }
      `}
      render={({ loading, data }) => {
        const containerRef = React.createRef();
        if (data) {
          const { __schema: { types } } = data;
          const gqlAggregationFields = types.find(
            ({ name }) => name === `${graphqlField}Aggregations`,
          ).fields;
          const extendAggsConfig = config =>
            config.filter(({ show }) => show).map(config => ({
              ...config,
              type: gqlAggregationFields.find(fileAggField => config.field === fileAggField.name)
                .type.name,
            }));
          const renderAggsConfig = ({ aggConfig, quickSearchFields = [] }) => (
            <AggregationsList
              {...{
                onValueChange: onValueChange,
                setSQON: setSQON,
                sqon,
                projectId,
                graphqlField,
                api,
                containerRef,
                aggs: aggConfig,
                debounceTime: 300,
                componentProps: {
                  getTermAggProps: () => ({
                    InputComponent: FilterInput,
                  }),
                },
                getCustomItems: ({ aggs }) =>
                  quickSearchFields.map(
                    (
                      { entityField, header, uploadableField, inputPlaceholder, modalTitle },
                      i,
                    ) => ({
                      index: aggs.length,
                      component: () => (
                        <QuickSearchBox
                          key={`${entityField}_${i}`}
                          uploadableFields={[uploadableField]}
                          inputPlaceholder={inputPlaceholder}
                          whitelist={[entityField]}
                          matchboxPlaceholderText={inputPlaceholder}
                          {...{
                            modalTitle,
                            graphqlField,
                            header,
                            setSQON,
                            translateSQONValue,
                            projectId,
                            ...props,
                          }}
                        />
                      ),
                    }),
                  ),
              }}
            />
          );
          return (
            <Column w="100%">
              <Column innerRef={containerRef}>
                <ShowIf condition={selectedTab === 'FILE'}>
                  {renderAggsConfig({
                    aggConfig: extendAggsConfig(FILE_FILTERS),
                    quickSearchFields: [
                      {
                        header: 'Search by File ID',
                        entityField: '', // "" denotes root level entity
                        uploadableField: 'kf_id',
                        inputPlaceholser: 'Eg. GF_851CMY87',
                      },
                    ],
                  })}
                </ShowIf>
                <ShowIf condition={selectedTab === 'CLINICAL'}>
                  {renderAggsConfig({
                    aggConfig: extendAggsConfig(CLINICAL_FILTERS),
                    quickSearchFields: [
                      {
                        header: 'Search Files by Biospecimen ID',
                        entityField: 'participants.biospecimens',
                        uploadableField: 'participants.biospecimens.kf_id',
                        inputPlaceholser: 'Eg. BS_4F9171D5, S88-3',
                      },
                      {
                        header: 'Search Files by Participant ID',
                        entityField: 'participants',
                        uploadableField: 'participants.kf_id',
                        inputPlaceholser: 'Eg. PT_RR05KSJC',
                      },
                    ],
                  })}
                </ShowIf>
              </Column>
            </Column>
          );
        } else {
          return null;
        }
      }}
    />
  ),
);
