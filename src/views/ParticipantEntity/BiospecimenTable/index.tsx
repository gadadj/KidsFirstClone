import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { Button } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import { generateLocalTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';
import { userColsHaveSameKeyAsDefaultCols } from 'utils/tables';

import { SectionId } from '../utils/anchorLinks';
import {
  getBiospecimensDefaultColumns,
  getBiospecimensFromParticipant,
} from '../utils/biospecimens';

import styles from '../index.module.css';

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const BiospecimenTable = ({ participant, loading }: OwnProps) => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const { biospecimens, total } = getBiospecimensFromParticipant(participant);

  const biospecimensDefaultColumns = getBiospecimensDefaultColumns();

  const userColumnPreferences = userInfo?.config?.participants?.tables?.biospecimens?.columns || [];
  const userColumnPreferencesOrDefault = userColsHaveSameKeyAsDefaultCols(
    userColumnPreferences,
    biospecimensDefaultColumns,
  )
    ? [...userColumnPreferences]
    : biospecimensDefaultColumns.map((c, index) => ({
        visible: true,
        index,
        key: c.key,
      }));

  return (
    <EntityTable
      id={SectionId.BIOSPECIMEN}
      loading={loading}
      data={biospecimens}
      title={intl.get('entities.biospecimen.biospecimen')}
      titleExtra={[
        <Button
          className={styles.viewInExplo}
          size="small"
          onClick={() => {
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: participant ? [participant.participant_id] : [],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            });
            navigate(STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS);
          }}
        >
          {intl.get('global.viewInExploration')}
          <ExternalLinkIcon />
        </Button>,
      ]}
      total={total}
      header={intl.get('entities.biospecimen.biospecimen')}
      columns={biospecimensDefaultColumns}
      initialColumnState={userColumnPreferencesOrDefault}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participants: {
                tables: {
                  biospecimens: {
                    columns: newState,
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            generateLocalTsvReport({
              index: INDEXES.PARTICIPANT,
              fileName: 'biospecimens',
              headers: biospecimensDefaultColumns,
              cols: userColumnPreferencesOrDefault.map((x) => ({
                visible: x.visible,
                key: x.key,
              })),
              rows: biospecimens.map((biospecimen) => ({
                ...biospecimen,
                source_text: (biospecimen.diagnoses?.hits?.edges ?? [])
                  .map((diagnose) => diagnose.node.source_text)
                  .join('\n'),
                mondo_display_term: (biospecimen.diagnoses?.hits?.edges ?? [])
                  .map((diagnose) => diagnose.node.mondo_display_term)
                  .join('\n'),
                ncit_display_term: (biospecimen.diagnoses?.hits?.edges ?? [])
                  .map((diagnose) => diagnose.node.ncit_display_term)
                  .join('\n'),
                source_text_tumor_descriptor: (biospecimen.diagnoses?.hits?.edges ?? [])
                  .map((diagnose) => diagnose.node.source_text_tumor_descriptor)
                  .join('\n'),
                source_text_tumor_location: (biospecimen.diagnoses?.hits?.edges ?? [])
                  .map((diagnose) => diagnose.node.source_text_tumor_location)
                  .join('\n'),
              })),
            }),
          ),
      }}
    />
  );
};

export default BiospecimenTable;
