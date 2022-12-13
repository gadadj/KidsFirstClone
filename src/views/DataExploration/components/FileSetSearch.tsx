import { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import SetSearch from 'components/uiKit/search/SetSearch';
import { INDEXES } from 'graphql/constants';
import useFileResolvedSqon from 'graphql/files/useFileResolvedSqon';
import { SetType } from 'services/api/savedSet/models';
import { DATA_EXPLORATION_QB_ID } from '../utils/constant';

const FileSetSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { sqon } = useFileResolvedSqon(queryBuilderId);

  return (
    <SetSearch
      index={INDEXES.FILES}
      title="Saved file sets"
      queryBuilderId={DATA_EXPLORATION_QB_ID}
      type={SetType.FILES}
      sqon={sqon}
      emptyDescription={'No file sets found'}
    />
  );
};

export default FileSetSearch;
