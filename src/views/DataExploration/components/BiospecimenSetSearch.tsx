import { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import useBiospecimenResolvedSqon from 'graphql/biospecimens/useBiospecimenResolvedSqon';
import { INDEXES } from 'graphql/constants';
import { SetType } from 'services/api/savedSet/models';
import { DATA_EXPLORATION_QB_ID } from '../utils/constant';
import SetSearch from 'components/uiKit/search/SetSearch';

const BiospecimenSetSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { sqon } = useBiospecimenResolvedSqon(queryBuilderId);

  return (
    <SetSearch
      index={INDEXES.BIOSPECIMENS}
      title="Saved biospecimen sets"
      queryBuilderId={DATA_EXPLORATION_QB_ID}
      type={SetType.BIOSPECIMEN}
      sqon={sqon}
      emptyDescription={'No sample sets found'}
    />
  );
};

export default BiospecimenSetSearch;
