import intl from 'react-intl-universal';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import UploadIds from '@ferlab/ui/core/components/UploadIds';
import { MatchTableItem } from '@ferlab/ui/core/components/UploadIds/types';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { CHECK_GENE_MATCH_QUERY } from 'graphql/genes/queries';
import { hydrateResults } from 'graphql/models';
import { IGeneEntity } from 'graphql/variants/models';

import { ArrangerApi } from 'services/api/arranger';

interface OwnProps {
  queryBuilderId: string;
}

const GenesUploadIds = ({ queryBuilderId }: OwnProps) => (
  <UploadIds
    dictionary={{
      modalTitle: intl.get('upload.gene.ids.modal.title'),
      submittedColTitle: intl.get('upload.gene.ids.modal.submittedColTitle'),
      uploadBtnText: intl.get('upload.gene.ids.modal.uploadBtnText'),
      modalUploadBtnText: intl.get('upload.gene.ids.modal.upload.file.btn'),
      mappedTo: intl.get('upload.gene.ids.modal.mappedTo'),
      clear: intl.get('upload.gene.ids.modal.clear.btn'),
      emptyTableDescription: intl.get('upload.gene.ids.modal.empty.table'),
      modalOkText: intl.get('upload.gene.ids.modal.upload.btn'),
      modalCancelText: intl.get('upload.gene.ids.modal.cancel.btn'),
      collapseTitle: (matchCount, unMatchCount) =>
        intl.get('upload.gene.ids.modal.collapseTitle', {
          matchCount,
          unMatchCount,
        }),
      matchTabTitle: (matchCount) => intl.get('upload.gene.ids.modal.match', { count: matchCount }),
      unmatchTabTitle: (unmatchcount) =>
        intl.get('upload.gene.ids.modal.unmatch', { count: unmatchcount }),
      tablesMessage: (submittedCount, mappedCount) =>
        intl.get('upload.gene.ids.modal.table.message', {
          submittedCount,
          mappedCount,
        }),
      inputLabel: intl.get('upload.gene.ids.modal.input.label'),
      matchTable: {
        idColTitle: intl.get('upload.gene.ids.modal.match.table.idcol.title'),
        matchToFieldColTitle: intl.get('upload.gene.ids.modal.match.table.matchcol.title'),
        mappedToFieldColTitle: intl.get('upload.gene.ids.modal.match.table.mappedcol.title'),
      },
    }}
    placeHolder="ex. ENSG00000157764, TP53"
    fetchMatch={async (ids) => {
      const response = await ArrangerApi.graphqlRequest({
        query: CHECK_GENE_MATCH_QUERY.loc?.source.body,
        variables: {
          first: 1000,
          offset: 0,
          sqon: generateQuery({
            operator: BooleanOperators.or,
            newFilters: ['symbol', 'ensembl_gene_id'].map((field) =>
              generateValueFilter({
                field,
                value: ids,
                index: INDEXES.GENES,
              }),
            ),
          }),
        },
      });

      const genes: IGeneEntity[] = hydrateResults(response.data?.data?.Genes?.hits?.edges || []);

      const matchResults = ids.map((id, index) => {
        const gene = genes.find((gene) => [gene.symbol, gene.ensembl_gene_id].includes(id));
        return gene
          ? {
              key: index.toString(),
              submittedId: id,
              mappedTo: gene.symbol,
              matchTo: gene.ensembl_gene_id,
            }
          : undefined;
      });

      return matchResults.filter((x) => !!x) as MatchTableItem[];
    }}
    onUpload={(match) =>
      updateActiveQueryField({
        queryBuilderId,
        field: 'consequences.symbol_id_1',
        value: match.map((value) => value.mappedTo),
        index: INDEXES.VARIANTS,
        overrideValuesName: intl.get('upload.gene.ids.modal.pill.title'),
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      })
    }
  />
);

export default GenesUploadIds;
