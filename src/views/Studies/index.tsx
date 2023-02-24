import { Link } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';
import { IStudiesEntity } from 'graphql/studies/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { STATIC_ROUTES } from 'utils/routes';

import PageContent from './components/PageContent';
import SideBarFacet from './components/SideBarFacet';
import StudySearch from './components/StudySearch';
import { SCROLL_WRAPPER_ID, STUDIES_REPO_QB_ID } from './utils/constant';

import styles from './index.module.scss';

const enum DataCategory {
  METABOLOMIC = 'Metabolomic',
  GENOMIC = 'Genomic',
  PROTEOMIC = 'Proteomic',
  TRANSCRIPTOMIC = 'Transcriptomic',
  CLINICAL = 'Clinical',
  IMMUNE_MAP = 'Immune-Map',
}

const hasDataCategory = (dataCategory: string[], category: DataCategory) =>
  dataCategory ? dataCategory.includes(category) ? <CheckOutlined /> : undefined : undefined;

const filterInfo: FilterInfo = {
  customSearches: [<StudySearch key={1} queryBuilderId={STUDIES_REPO_QB_ID} />],
  defaultOpenFacets: ['program', 'data_category', 'experimental_strategy', 'family_data'],
  groups: [
    {
      facets: ['program', 'data_category', 'experimental_strategy', 'family_data'],
    },
  ],
};

const columns: ProColumnType<any>[] = [
  {
    key: 'study_code',
    title: 'Code',
    render: (record: IStudiesEntity) => (
      <ExternalLink href={record.website}>{record.study_code}</ExternalLink>
    ),
  },
  {
    key: 'study_name',
    title: 'Name',
    dataIndex: 'study_name',
    width: 500,
  },
  {
    key: 'program',
    title: 'Program',
    dataIndex: 'program',
    render: (program: string) => program || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'domain',
    title: 'Domain',
    dataIndex: 'domain',
    render: (domain: string) => domain || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_id',
    title: 'dbGaP',
    dataIndex: 'external_id',
    render: (externalId: string) => (
      <ExternalLink
        href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${externalId}`}
      >
        {externalId}
      </ExternalLink>
    ),
  },
  {
    key: 'participant_count',
    title: 'Participants',
    render: (record: IStudiesEntity) => {
      const participantCount = record.participant_count;

      return participantCount ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'study.study_code',
                    value: [record.study_code],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {participantCount}
        </Link>
      ) : (
        participantCount || 0
      );
    },
  },
  {
    key: 'biospecimen_count',
    title: 'Biospecimens',
    render: (record: IStudiesEntity) => {
      const biospecimenCount = record.biospecimen_count;

      return biospecimenCount ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'study.study_code',
                    value: [record.study_code],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {biospecimenCount}
        </Link>
      ) : (
        biospecimenCount || 0
      );
    },
  },
  {
    key: 'family_count',
    title: 'Families',
    dataIndex: 'family_count',
  },
  {
    key: 'clinical',
    title: 'Clinical',
    align: 'center',
    render: (record: IStudiesEntity) =>
      hasDataCategory(record.data_category, DataCategory.PROTEOMIC) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'genomic',
    title: 'Genomics',
    align: 'center',
    render: (record: IStudiesEntity) =>
      hasDataCategory(record.data_category, DataCategory.GENOMIC) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'transcriptomic',
    title: 'Transcriptomics',
    align: 'center',
    render: (record: IStudiesEntity) =>
      hasDataCategory(record.data_category, DataCategory.TRANSCRIPTOMIC) ||
      TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'proteomic',
    title: 'Proteomics',
    align: 'center',
    render: (record: IStudiesEntity) =>
      hasDataCategory(record.data_category, DataCategory.PROTEOMIC) || TABLE_EMPTY_PLACE_HOLDER,
  },
];

const Studies = () => {
  const studiesMappingResults = useGetExtendedMappings(INDEXES.STUDIES);

  return (
    <div className={styles.studiesPage}>
      <SideBarFacet extendedMappingResults={studiesMappingResults} filterInfo={filterInfo} />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent defaultColumns={columns} extendedMappingResults={studiesMappingResults} />
      </ScrollContent>
    </div>
  );
};

export default Studies;
