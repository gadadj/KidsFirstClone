import React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import ContentBar from './ContentBar';
import Summary from './Summary';
import Row from 'uikit/Row';
import ViewLink from 'uikit/ViewLink';
import styled from 'react-emotion';
import { H2 } from 'uikit/Headings';
import ParticipantsTableView from './ParticipantsTableView';
import SummaryIcon from 'icons/AllAppsMenuIcon';
import TableViewIcon from 'icons/TableViewIcon';
import DemographicIcon from 'icons/DemographicIcon';
import { Link } from 'react-router-dom';
import { withApi } from 'services/api';
import QueriesResolver from './QueriesResolver';
import { cohortResults } from './ParticipantsTableView/queries';
import TableErrorView from './ParticipantsTableView/TableErrorView';
import LoadingSpinner from 'uikit/LoadingSpinner';

const SUMMARY = 'summary';
const TABLE = 'table';

const ViewLinks = styled(Row)`
  > div:not(:last-child) {
    margin-right: 30px;
  }
`;

const Detail = styled(Row)`
  align-items: center;
`;

const Heading = styled(H2)`
  color: ${({ theme }) => theme.secondary};
  margin-right: 20px;
`;

const ActiveView = styled('div')`
  width: 100%;
  padding: 0 26px 36px 26px;
  margin-top: 19px;
`;

const SubHeading = styled('h3')`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 600)};
  font-family: ${({ theme }) => theme.default};
  font-size: 16px;
  color: ${({ color, theme }) => (color ? color : theme.secondary)};
  padding: 0 3px;
  margin: 0;
`;

const PurpleLink = styled(Link)`
  color: ${({ theme }) => theme.purple};
`;

const Results = ({ activeView, setActiveView, theme, sqon, api }) => (
  <QueriesResolver api={api} queries={[cohortResults(sqon)]}>
    {({ isLoading, data, error }) => {
      const cohortIsEmpty =
        !data[0] || (data[0].participantCount === 0 || data[0].filesCount === 0);
      return isLoading ? (
        <Row nogutter>
          <div className={theme.fillCenter} style={{ marginTop: '30px' }}>
            <LoadingSpinner color={theme.greyScale11} size={'50px'} />
          </div>
        </Row>
      ) : error ? (
        <TableErrorView error={error} />
      ) : (
        <React.Fragment>
          <ContentBar>
            <Detail>
              <Heading>All data</Heading>
              <DemographicIcon />
              <SubHeading>
                {Number(data[0].participantCount || 0).toLocaleString()} Participants with{' '}
              </SubHeading>
              <PurpleLink to="">
                <SubHeading color={theme.purple}>{`${Number(
                  data[0].filesCount || 0,
                ).toLocaleString()} Files`}</SubHeading>
              </PurpleLink>
            </Detail>
            <ViewLinks>
              <ViewLink onClick={() => setActiveView(SUMMARY)} active={activeView === SUMMARY}>
                <SummaryIcon marginRight={5} />
                Summary View
              </ViewLink>
              <ViewLink onClick={() => setActiveView(TABLE)} active={activeView === TABLE}>
                <TableViewIcon marginRight={5} />
                Table View
              </ViewLink>
            </ViewLinks>
          </ContentBar>
          <ActiveView>
            {activeView === SUMMARY ? (
              <Summary sqon={!cohortIsEmpty ? sqon : null} />
            ) : (
              <ParticipantsTableView sqon={!cohortIsEmpty ? sqon : null} />
            )}
          </ActiveView>
        </React.Fragment>
      );
    }}
  </QueriesResolver>
);

export default compose(
  withTheme,
  withApi,
  withState('activeView', 'setActiveView', SUMMARY),
)(Results);
