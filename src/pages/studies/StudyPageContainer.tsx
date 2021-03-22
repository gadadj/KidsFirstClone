/* eslint-disable react/display-name */
import React, { FC } from 'react';
import { getStudiesPageData } from 'store/graphql/studies/actions';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Table } from 'antd';
import { studiesColumns } from '../../store/graphql/studies/models';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import {
  getQueryBuilderCache,
  setQueryBuilderCache,
  updateQueryFilters,
  updateQueryParam,
  useFilters,
} from './utils';
import history from 'services/history';
import StudyTableContainer from './StudyTableContainer';

interface IBucket {
  doc_count: number;
  key: string;
}

const StudyPageContainer: FC = () => {
  const { filters, mappedFilters } = useFilters();

  const totalStudies = 10; // data.length || 0;

  return (
    <StackLayout vertical>
      <QueryBuilder
        // IconTotal={<MdAssignment />}
        className="file-repo__query-builder"
        currentQuery={filters}
        initialState={getQueryBuilderCache('study-repo')}
        loading={false}
        onChangeQuery={(_, query) => updateQueryParam(history, 'filters', query)}
        onRemoveFacet={(query) => updateQueryFilters(history, query.content.field, [])}
        onUpdate={(state) => setQueryBuilderCache('study-repo', state)}
        total={totalStudies}
      />
      <StudyTableContainer />
    </StackLayout>
  );
};

export default StudyPageContainer;
