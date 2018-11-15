import React, { Fragment } from 'react';
import Spinner from 'react-spinkit';
import styled from 'react-emotion';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';

import { Box, Link } from 'uikit/Core';
import Column from 'uikit/Column';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import LoadingSpinner from 'uikit/LoadingSpinner';

import { DashboardCard } from '../styles';

import QueryBlock from './QueryBlock';
import CardHeader from '../../../uikit/Card/CardHeader';

const QueriesHeading = styled('h4')`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.75;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 7px;
  margin-top: 0;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
`;

const Container = styled(Column)`
  margin: 15px 0;
  flex: 3;
  border-top: 0;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 0 10px;
`;

const FileRepositoryLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
`;

export const MySavedQueries = compose(
  provideSavedQueries,
  injectState,
  lifecycle({
    componentDidMount() {
      const { api } = this.props;
      this.props.effects.getQueries({ egoId: this.props.loggedInUser.egoId, api });
    },
  }),
)(
  ({
    state: { queries, exampleQueries, loadingQueries, deletingIds },
    effects: { getQueries, deleteQuery },
    api,
    theme,
  }) => (
    <DashboardCard title="Saved Queries" Header={CardHeader} badge={queries.length} scrollable>
      {loadingQueries ? (
        <LoadingSpinner />
      ) : (
        <Container>
          {!queries.length ? (
            <Fragment>
              <PromptMessageContainer info mb={'8px'}>
                <PromptMessageHeading info mb={10}>
                  You have no saved queries yet.
                </PromptMessageHeading>
                <PromptMessageContent>
                  Explore the
                  <FileRepositoryLink to="/search/file"> File Repository</FileRepositoryLink> and
                  start saving queries!
                </PromptMessageContent>
              </PromptMessageContainer>
              <Box mt={2} mb={2}>
                <QueriesHeading>Examples:</QueriesHeading>
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
            </Fragment>
          ) : (
            <Box mt={2} mb={2}>
              {queries
                .filter(q => q.alias)
                .map(q => ({
                  ...q,
                  date: Number(new Date(q.creationDate)),
                  link: `/search${q.content.longUrl.split('/search')[1]}`,
                }))
                .slice()
                .sort((a, b) => b.date - a.date)
                .map(q => (
                  <QueryBlock key={q.id} query={q} inactive={deletingIds.includes(q.id)} />
                ))}
            </Box>
          )}
        </Container>
      )}
    </DashboardCard>
  ),
);
export default MySavedQueries;
