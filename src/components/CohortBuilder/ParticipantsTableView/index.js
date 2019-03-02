import React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import { withApi } from 'services/api';
import { participantsQuery } from './queries';

import QueriesResolver from '../QueriesResolver';
import ParticipantsTable from './ParticipantsTable';
import TableErrorView from './TableErrorView';

import EmptyCohortOverlay from './../EmptyCohortOverlay';

const enhance = compose(
  withApi,
  withTheme,
  withState('pageSize', 'setPageSize', 10),
  withState('pageIndex', 'setPageIndex', 0),
);

const ParticipantsTableView = ({
  sqon,
  api,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  noData = false,
}) => (
  <QueriesResolver api={api} sqon={sqon} queries={[participantsQuery(sqon, pageSize, pageIndex)]}>
    {({ isLoading, data, error }) =>
      error ? (
        <TableErrorView error={error} />
      ) : (
        <React.Fragment>
          {noData ? <EmptyCohortOverlay /> : null}
          <ParticipantsTable
            loading={isLoading}
            data={data[0] ? data[0].nodes : []}
            dataTotalCount={data[0] ? data[0].total : 0}
            onFetchData={({ page, pageSize }) => {
              setPageIndex(page);
              setPageSize(pageSize);
            }}
          />
        </React.Fragment>
      )
    }
  </QueriesResolver>
);

export default enhance(ParticipantsTableView);
