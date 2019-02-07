import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { topDiagnosesBarMock, studiesBarMock } from './mock';
import Card from 'uikit/Card';
import MultiHeader from 'uikit/Multicard/MultiHeader';
import { Col, Row } from 'react-grid-system';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './DemographicChart';

const mostFrequentDiagnosisTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const studiesToolTip = data => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands.toLocaleString()} Probands`}</div>
      <div>{`${familyMembers.toLocaleString()} Family Members`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`}</div>
    </div>
  );
};

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const CardSlot = styled(Card)`
  height: 305px;
`;

const LongCard = styled(Card)`
  height: 100%;
`;

const md = 4;
const lg = 4;

const enhance = compose(
  withApi,
  withTheme,
);

const multiHeader = (
  <MultiHeader
    headings={[{ title: 'Studies', badge: 7 }, { title: 'Participants', badge: 6155 }]}
  />
);

const Summary = ({ theme, sqon, api }) => (
  <QueriesResolver api={api} sqon={sqon} queries={[demographicQuery({ ...{ sqon } })]}>
    {({ loading, data }) => {
      return loading || !data ? (
        <div> loading</div>
      ) : (
        <Row nogutter>
          <Col sm={12} md={9} lg={9}>
            <Row nogutter>
              <Col sm={12} md={md} lg={lg}>
                <CardSlot title="Overall Survival" />
              </Col>
              <Col sm={12} md={md} lg={lg}>
                <CardSlot title={multiHeader}>
                  <HorizontalBar
                    data={studiesBarMock}
                    indexBy="label"
                    keys={['probands', 'familyMembers']}
                    tooltipFormatter={studiesToolTip}
                    sortBy={sortDescParticipant}
                    tickInterval={4}
                    colors={[theme.chartColors.blue, theme.chartColors.purple]}
                    xTickTextLength={28}
                    legends={[
                      { title: 'Probands', color: theme.chartColors.blue },
                      { title: 'Family Members', color: theme.chartColors.purple },
                    ]}
                    padding={0.5}
                  />
                </CardSlot>
              </Col>
              <Col sm={12} md={md} lg={lg}>
                <CardSlot title="Most Frequent Diagnoses">
                  <HorizontalBar
                    style={{ maxWidth: '100px' }}
                    data={topDiagnosesBarMock}
                    indexBy="label"
                    keys={['probands', 'familyMembers']}
                    tooltipFormatter={mostFrequentDiagnosisTooltip}
                    sortByValue={true}
                    tickInterval={4}
                    colors={[theme.chartColors.blue, theme.chartColors.purple]}
                    xTickTextLength={28}
                    legends={[
                      { title: 'Probands', color: theme.chartColors.blue },
                      { title: 'Family Members', color: theme.chartColors.purple },
                    ]}
                    padding={0.5}
                  />
                </CardSlot>
              </Col>
              <Col sm={12} md={md} lg={lg}>
                <DemographicChart data={data} />
              </Col>
              <Col sm={12} md={md} lg={lg}>
                <CardSlot title="File Breakdown" />
              </Col>
              <Col sm={12} md={md} lg={lg}>
                <CardSlot title="Age at Diagnosis" />
              </Col>
            </Row>
          </Col>
          <Col sm={12} md={3} lg={3}>
            <LongCard title="Phenotypes">
              <pre>{JSON.stringify(sqon, null, 2)}</pre>
            </LongCard>
          </Col>
        </Row>
      );
    }}
  </QueriesResolver>
);

export default enhance(Summary);
