/* eslint-disable react/prop-types */
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Button, notification, Popconfirm, Result, Spin, Table } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/rootState';
import {
  DeleteSetParams,
  DispatchSaveSets,
  SaveSetActionsTypes,
  SaveSetState,
  SetInfo,
} from 'store/saveSetTypes';
import { selectUserSets } from 'store/selectors/saveSetsSelectors';
import {
  createQueryInCohortBuilder,
  deleteUserSets,
  fetchSetsIfNeeded,
} from 'store/actionCreators/saveSets';

import { AlignType } from 'rc-table/lib/interface';

import './ParticipantSets.scss';
import { LoggedInUser } from 'store/userTypes';
import participantMagenta from 'assets/icon-participants-magenta.svg';
import SaveSetModal from '../../CohortBuilder/ParticipantsTableView/SaveSetModal';
import { Link } from 'react-router-dom';

type OwnProps = {
  user: LoggedInUser;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: selectUserSets(state),
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onClickParticipantsLink: (setId: string) => dispatch(createQueryInCohortBuilder(setId)),
  deleteSaveSet: (deleteSetParams: DeleteSetParams) => dispatch(deleteUserSets(deleteSetParams)),
  fetchUserSetsIfNeeded: (userId: string) => dispatch(fetchSetsIfNeeded(userId)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const align = 'right' as AlignType;

const onDeleteFail = () => {
  notification.error({
    message: 'Error',
    description: `Deleting this Saved Set has failed`,
    duration: 10,
  });
};

const ParticipantSets: FunctionComponent<Props> = (props) => {
  const { user, userSets, deleteSaveSet, onClickParticipantsLink, fetchUserSetsIfNeeded } = props;
  const [showModal, setShowModal] = useState(false);
  const [editSet, setEditSet] = useState({
    key: '',
    name: '',
    count: 0,
    currentUser: '',
  } as SetInfo);

  useEffect(() => {
    fetchUserSetsIfNeeded(user.egoId);
  }, [user, fetchUserSetsIfNeeded]);

  const confirm = (setId: string) => {
    deleteSaveSet({ setIds: [setId], onFail: onDeleteFail } as DeleteSetParams);
  };

  const onEditClick = (record: SetInfo) => {
    setEditSet(record);
    setShowModal(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: (name: string, record: SetInfo) => (
        <div className={'save-set-column-name'}>
          <div className={'save-set-table-name'}>
            {name}{' '}
            <Button size={'small'} type={'text'} onClick={() => onEditClick(record)}>
              <EditFilled className={'edit-icon'} />
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      width: 80,
      align: align,
      // eslint-disable-next-line react/display-name
      render: (count: number, record: SetInfo) => (
        <Link
          className={'classNames'}
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            onClickParticipantsLink(record.key);
            const toTop = document.getElementById('main-page-container');
            toTop?.scrollTo(0, 0);
          }}
        >
          <Button className={'count-button'} type="text">
            {' '}
            <img src={participantMagenta} alt="Participants" />
            <div className={'save-sets-participants-count'}>{count}</div>
          </Button>
        </Link>
      ),
    },
    {
      title: '',
      key: 'delete',
      dataIndex: 'key',
      width: 40,
      // eslint-disable-next-line react/display-name
      render: (setId: string) => (
        <Popconfirm
          title="Permanently delete this set?"
          onConfirm={() => confirm(setId)}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button size={'small'} type="text">
            <DeleteFilled />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const data: SetInfo[] = userSets.sets.map((s) => ({
    key: s.setId,
    name: s.tag,
    count: s.size,
    currentUser: user.egoId,
  }));

  return (
    <Fragment>
      {showModal && (
        <SaveSetModal
          title={'Edit Set Name'}
          user={user}
          hideModalCb={() => {
            setShowModal(false);
            setEditSet({ key: '', name: '', count: 0, currentUser: '' });
          }}
          onFail={onDeleteFail}
          setToRename={editSet}
          saveSetActionType={SaveSetActionsTypes.EDIT}
        />
      )}
      {userSets.isLoading ? (
        <div className={'participant-set-spinner-container'}>
          <Spin size={'large'} />
        </div>
      ) : !userSets.error ? (
        <Table className="user-sets-table" columns={columns} dataSource={data} pagination={false} />
      ) : (
        <Result status="error" title="Failed to load user SaveSets" />
      )}
    </Fragment>
  );
};

const Connected = connector(ParticipantSets);

export default Connected;
