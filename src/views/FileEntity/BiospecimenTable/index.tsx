import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { IFileEntity } from 'graphql/files/models';
import { SectionId } from 'views/FileEntity';
import getBiospecimensColumns from 'views/FileEntity/utils/getBiospecimensColumns';

import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';

interface OwnProps {
  file?: IFileEntity;
  loading: boolean;
}

const BiospecimenTable = ({ file, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const biospecimens: IBiospecimenEntity[] =
    file?.biospecimens?.hits?.edges?.map((e) => ({ key: e.node.sample_id, ...e.node })) || [];

  return (
    <EntityTable
      id={SectionId.PARTICIPANT_SAMPLE}
      loading={loading}
      data={biospecimens}
      title={intl.get('entities.file.participant_sample.title')}
      header={intl.get('entities.file.participant_sample.title')}
      columns={getBiospecimensColumns()}
      initialColumnState={userInfo?.config.files?.tables?.biospecimens?.columns}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({ files: { tables: { biospecimens: { columns: newState } } } }),
          ),
      }}
    />
  );
};

export default BiospecimenTable;
