import React from 'react';
import styled from 'react-emotion';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';

import { Box, Link } from 'uikit/Core';
import Column from 'uikit/Column';
import { PromptMessageContainer, PromptMessageContent } from '../styles';

import { CardContentSpinner } from '../styles';

import { DashboardCard } from '../styles';

import QueryBlock from './QueryBlock';
import CardHeader from 'uikit/Card/CardHeader';

import Component from 'react-component-component';
import {
  fetchVirtualStudiesCollection,
  loadSavedVirtualStudy,
} from '../../../store/actionCreators/virtualStudies';
import { Tabs, ShowIf } from 'components/FileRepo/AggregationSidebar/CustomAggregationsPanel';
import { connect } from 'react-redux';
import Row from 'uikit/Row';
import { Flex } from 'uikit/Core';
import Tooltip from 'uikit/Tooltip';
import { css } from 'react-emotion';

const Container = styled(Column)`
  margin: 0 0 15px 0;
  flex: 3;
  border-top: 0;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const FileRepositoryLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
`;

const Study = styled(Flex)`
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  transition-property: opacity;
  ${({ inactive, theme }) =>
    inactive
      ? `
          opacity: 0.6;
          pointer-events: none;
          &:last-child {
            border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
          }
        `
      : ``};
`;

const StudyLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const Scroll = styled('div')`
  position: absolute;
  top: 83px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const studyDescriptionStyle = css({
  fontSize: '12px',
  fontFamily: 'Open Sans, sans-serif',
  maxWidth: '400px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

const studyStyle = css({
  display: 'flex',
  flexDirection: 'column',
});

const mapDispatchToProps = {
  fetchVirtualStudiesCollection,
  loadSavedVirtualStudy,
};

const mapStateToProps = state => {
  const { virtualStudies } = state;
  return {
    virtualStudies: virtualStudies.studies,
  };
};

let descriptions = new Array(20);

const virtualStudyLoad = (id, index, props) => {
  props
    .loadSavedVirtualStudy(id)
    .then(data => {
      if (data) {
        descriptions.splice(index, 1, data.payload.description);
      }
    })
    .catch(error => console.error(`Error loading virtual study "${id}"`, error));
};

export const MySavedQueries = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  provideSavedQueries,
  injectState,
  lifecycle({
    componentDidMount() {
      const { api } = this.props;
      this.props.effects.getQueries({ egoId: this.props.loggedInUser.egoId, api });
      this.props.fetchVirtualStudiesCollection(this.props.loggedInUser.egoId);
    },
  }),
)(
  ({
    state: { queries, exampleQueries, loadingQueries, deletingIds },
    effects: { getQueries, deleteQuery },
    api,
    theme,
    ...props
  }) => {
    const { virtualStudies } = props;
    return (
      <Component initialState={{ selectedTab: 'FILES' }}>
        {({ state: { selectedTab }, setState }) => (
          <DashboardCard showHeader={false}>
            {loadingQueries ? (
              <CardContentSpinner />
            ) : (
              <div>
                <CardHeader title="Saved Queries" style={{ margin: '5px 0 15px 0' }} />
                <Container>
                  <Tabs
                    selectedTab={selectedTab}
                    options={[
                      {
                        id: 'PARTICIPANTS',
                        display: 'Participants',
                        total: virtualStudies.length ? virtualStudies.length : [0],
                      },
                      {
                        id: 'FILES',
                        display: 'Files',
                        total: queries.length ? queries.length : [0],
                      },
                    ]}
                    onTabSelect={({ id }) => setState({ selectedTab: id })}
                  />
                  <ShowIf condition={selectedTab === 'FILES'}>
                    {!queries.length ? (
                      <Scroll>
                        <Box mt={2}>
                          <PromptMessageContainer info mb={'8px'}>
                            <PromptMessageContent>
                              Explore the{' '}
                              <FileRepositoryLink to="/search/file">
                                File Repository
                              </FileRepositoryLink>{' '}
                              to save queries!
                            </PromptMessageContent>
                          </PromptMessageContainer>
                        </Box>
                        <Box mt={2} mb={2}>
                          {exampleQueries.map(q => {
                            q.link = `/search${q.content.longUrl.split('/search')[1]}`;
                            return (
                              <QueryBlock
                                key={q.id}
                                query={q}
                                inactive={deletingIds.includes(q.id)}
                                savedTime={false}
                              />
                            );
                          })}
                        </Box>
                      </Scroll>
                    ) : (
                      <Scroll>
                        <Box mt={2} mb={2}>
                          {queries
                            .filter(q => q.alias && q.content.Files)
                            .map(q => ({
                              ...q,
                              date: Number(new Date(q.creationDate)),
                              link: `/search${q.content.longUrl.split('/search')[1]}`,
                            }))
                            .slice()
                            .sort((a, b) => b.date - a.date)
                            .map(q => (
                              <QueryBlock
                                key={q.id}
                                query={q}
                                inactive={deletingIds.includes(q.id)}
                              />
                            ))}
                        </Box>
                      </Scroll>
                    )}
                  </ShowIf>
                  <ShowIf condition={selectedTab === 'PARTICIPANTS'}>
                    {!virtualStudies.length ? (
                      <Box mt={2}>
                        <PromptMessageContainer info mb={'8px'}>
                          <PromptMessageContent>
                            <FileRepositoryLink to="/explore">Explore Data</FileRepositoryLink> and
                            save virtual studies!
                          </PromptMessageContent>
                        </PromptMessageContainer>
                      </Box>
                    ) : (
                      <Box mt={2} mb={2}>
                        <Scroll>
                          {virtualStudies.map((s, index) => (
                            <Study key={s.id}>
                              <Row justifyContent="space-between" width="100%">
                                <div className={`${studyStyle}`}>
                                  <StudyLink to={`/explore?id=${s.id}`}>{s.name}</StudyLink>
                                  {virtualStudyLoad(s.id, index, props)}
                                  <Tooltip html={descriptions[index]}>
                                    <div className={`${studyDescriptionStyle}`}>
                                      {descriptions[index]}
                                    </div>
                                  </Tooltip>
                                </div>
                              </Row>
                            </Study>
                          ))}
                        </Scroll>
                      </Box>
                    )}
                  </ShowIf>
                </Container>
              </div>
            )}
          </DashboardCard>
        )}
      </Component>
    );
  },
);
export default MySavedQueries;
