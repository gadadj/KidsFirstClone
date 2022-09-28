import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { useFilters } from '@ferlab/ui/core/data/filters/utils';
import { ISqonGroupFilter, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { Tooltip } from 'antd';
import cx from 'classnames';
import { ArrangerResultsTree, IQueryResults } from 'graphql/models';
import {
  IClinVar,
  IConsequenceNode,
  IExternalFrequenciesEntity,
  ITableVariantEntity,
  IVariantEntity,
} from 'graphql/variants/models';
import ConsequencesCell from 'views/Variants/components/ConsequencesCell';
import { DEFAULT_PAGE_SIZE, SCROLL_WRAPPER_ID } from 'views/Variants/utils/constants';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IQueryConfig, TQueryConfigCb } from 'common/searchPageTypes';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.scss';
import { IStudiesEntity } from 'graphql/studies/models';

interface OwnProps {
  results: IQueryResults<IVariantEntity[]>;
  setQueryConfig: TQueryConfigCb;
  queryConfig: IQueryConfig;
  sqon?: ISqonGroupFilter;
}

const isNumber = (n: number) => n && !Number.isNaN(n);
const toExponentialNotation = (n: number, fractionDigits = 2) => n.toExponential(fractionDigits);

const defaultColumns: ProColumnType[] = [
  {
    title: intl.get('screen.variants.table.variant'),
    key: 'hgvsg',
    dataIndex: 'hgvsg',
    className: cx(styles.variantTableCell, styles.variantTableCellElipsis),
    fixed: 'left',
    render: (hgvsg: string, entity: IVariantEntity) =>
      hgvsg ? (
        <Tooltip placement="topLeft" title={hgvsg}>
          <Link target="_blank" to={`/variant/entity/${entity.locus}`}>
            {hgvsg}
          </Link>
        </Tooltip>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'variant_class',
    title: intl.get('screen.variants.table.variant_class'),
    dataIndex: 'variant_class',
    sorter: {
      multiple: 1,
    },
  },
  {
    key: 'rsnumber',
    title: intl.get('screen.variants.table.dbsnp'),
    dataIndex: 'rsnumber',
    className: styles.dbSnpTableCell,
    render: (rsNumber: string) =>
      rsNumber ? (
        <ExternalLink href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`}>
          {rsNumber}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'consequences',
    title: intl.get('screen.variants.table.consequences'),
    dataIndex: 'consequences',
    width: 300,
    render: (consequences: { hits: { edges: IConsequenceNode[] } }) => (
      <ConsequencesCell consequences={consequences?.hits?.edges || []} />
    ),
  },
  {
    key: 'clinvar',
    title: intl.get('screen.variants.table.clinvar'),
    dataIndex: 'clinvar',
    className: cx(styles.variantTableCell, styles.variantTableCellElipsis),
    render: (clinVar: IClinVar) =>
      clinVar?.clin_sig && clinVar.clinvar_id ? (
        <ExternalLink href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}>
          {clinVar.clin_sig.join(', ')}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    title: 'Studies',
    dataIndex: 'studies',
    key: 'studies',
    render: (studies: ArrangerResultsTree<IStudiesEntity>) => studies?.hits?.total || 0,
  },
  {
    title: 'Participants',
    dataIndex: 'participant_number',
    key: 'part',
  },
  {
    title: 'Freq.',
    dataIndex: 'participant_frequency',
    key: 'participant_frequency',
    render: (participantFrequency: number) =>
      isNumber(participantFrequency)
        ? toExponentialNotation(participantFrequency)
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    title: 'ALT',
    dataIndex: 'frequencies',
    key: 'alternate',
    render: (frequencies: IExternalFrequenciesEntity) => frequencies?.internal?.upper_bound_kf?.ac,
  },
  {
    title: 'Homo.',
    dataIndex: 'frequencies',
    key: 'homozygotes',
    render: (frequencies: IExternalFrequenciesEntity) =>
      frequencies?.internal?.upper_bound_kf?.homozygotes,
  },
];

const VariantsTab = ({ results, setQueryConfig, queryConfig, sqon }: OwnProps) => {
  const { filters }: { filters: ISyntheticSqon } = useFilters();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(filters)]);

  return (
    <ProTable<ITableVariantEntity>
      tableId="variants_table"
      columns={defaultColumns}
      wrapperClassName={styles.variantTabWrapper}
      loading={results.loading}
      enableRowSelection={true}
      initialSelectedKey={selectedKeys}
      showSorterTooltip={false}
      onChange={({ current, pageSize }, _, sorter) =>
        setQueryConfig({
          pageIndex: current!,
          size: pageSize!,
          sort: formatQuerySortList(sorter),
        })
      }
      headerConfig={{
        itemCount: {
          pageIndex: queryConfig.pageIndex,
          pageSize: queryConfig.size,
          total: results.total,
        },
      }}
      bordered
      size="small"
      pagination={{
        current: queryConfig.pageIndex,
        pageSize: queryConfig.size,
        defaultPageSize: DEFAULT_PAGE_SIZE,
        total: results.total,
        onChange: () => scrollToTop(SCROLL_WRAPPER_ID),
      }}
      dataSource={results.data.map((i) => ({ ...i, key: i.id }))}
      dictionary={getProTableDictionary()}
    />
  );
};

export default VariantsTab;
