import { Layout, Spin } from 'antd';
import { generateFilters } from 'graphql/utils/Filters';
import useGetAggregations from 'hooks/graphql/useGetAggregations';
import { AGGREGATION_QUERY } from 'graphql/queries';

import styles from './Filters.module.scss';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';

type OwnProps = {
  queryBuilderId: string;
  index: string;
  field: string;
  sqon: any;
  extendedMappingResults: IExtendedMappingResults;
};

const GenericFilters = ({
  queryBuilderId,
  index,
  field,
  sqon,
  extendedMappingResults,
}: OwnProps) => {
  const results = useGetAggregations(
    {
      sqon,
    },
    AGGREGATION_QUERY(index, [field], extendedMappingResults),
    index,
  );

  return (
    <Spin size="large" spinning={results.loading}>
      <Layout className={`${styles.filterWrapper} ${styles.genericFilterWrapper}`}>
        {generateFilters({
          queryBuilderId,
          aggregations: results?.aggregations,
          extendedMapping: extendedMappingResults,
          className: styles.customFilterContainer,
          filtersOpen: true,
          filterFooter: true,
          showSearchInput: true,
          useFilterSelector: true,
          index,
        })}
      </Layout>
    </Spin>
  );
};

export default GenericFilters;
