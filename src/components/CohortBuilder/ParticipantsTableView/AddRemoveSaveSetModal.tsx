/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { Button, Form, Modal, notification } from 'antd';
import { Sqon } from 'store/sqon';
import { Store } from 'antd/lib/form/interface';
import { selectIsEditingSets, selectSets } from 'store/selectors/saveSetsSelectors';
import { RootState } from 'store/rootState';
import {
  AddRemoveSetParams,
  DispatchSaveSets,
  SaveSetState,
  SetSubActionTypes,
} from 'store/saveSetTypes';
import { connect, ConnectedProps } from 'react-redux';
import { addRemoveSetIds } from 'store/actionCreators/saveSets';
import './AddRemoveSaveSetModal.css';
import { LoggedInUser } from 'store/userTypes';
import UserSetsFrom from './../UserSetsForm';

const FORM_NAME = 'add-remove-set';

type OwnProps = {
  hideModalCb: Function;
  user: LoggedInUser;
  sqon: Sqon;
  subActionType: SetSubActionTypes;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: selectSets(state),
    isLoading: false,
    error: null,
    isDeleting: false,
    isEditing: selectIsEditingSets(state),
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onAddRemoveSetIds: (params: AddRemoveSetParams) => dispatch(addRemoveSetIds(params)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const finishButtonText = (type: string) => {
  switch (type) {
    case SetSubActionTypes.ADD_IDS:
      return 'Add to set';
    case SetSubActionTypes.REMOVE_IDS:
      return 'Remove from set';
    default:
      break;
  }
};

const formTitle = (type: string) => {
  switch (type) {
    case SetSubActionTypes.ADD_IDS:
      return 'Add to a participant set';
    case SetSubActionTypes.REMOVE_IDS:
      return 'Remove from a participant set';
    default:
      break;
  }
};

const AddRemoveSaveSetModal: FunctionComponent<Props> = (props) => {
  const { hideModalCb, subActionType, userSets, user, onAddRemoveSetIds, sqon } = props;
  const [isVisible, setIsVisible] = useState(true);

  const onFinish = async (values: Store) => {
    const { setId } = values;
    switch (subActionType) {
      case SetSubActionTypes.ADD_IDS:
        onAddRemoveSetIds({
          setId: setId,
          userId: user.egoId,
          subActionType: SetSubActionTypes.ADD_IDS,
          sqon: sqon,
          type: 'participant',
          path: 'kf_id',
          onSuccess: () => {
            notification.success({
              message: 'Success',
              description: `The participants were added to the set.`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
          onFail: () => {
            notification.error({
              message: 'Error',
              description: `Adding participants to this set has failed`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
        });
        break;
      case SetSubActionTypes.REMOVE_IDS:
        onAddRemoveSetIds({
          setId: setId,
          userId: user.egoId,
          subActionType: SetSubActionTypes.REMOVE_IDS,
          sqon: sqon,
          type: 'participant',
          path: 'kf_id',
          onSuccess: () => {
            notification.success({
              message: 'Success',
              description: `The participants were removed from the set.`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
          onFail: () => {
            notification.error({
              message: 'Error',
              description: `Removing participants from this set has failed`,
              duration: 10,
            });
            setIsVisible(false);
            hideModalCb();
          },
        });
        break;
      default:
        setIsVisible(false);
        hideModalCb();
        break;
    }
  };

  const onCancel = () => {
    setIsVisible(false);
    hideModalCb();
  };

  return (
    <Modal
      title={formTitle(subActionType)}
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Form.Item key={'submit'} noStyle>
          <Button
            id="EditSaveSets"
            form={FORM_NAME}
            htmlType="submit"
            key="save"
            type="primary"
            loading={userSets.isEditing}
          >
            {finishButtonText(subActionType)}
          </Button>
        </Form.Item>,
      ]}
    >
      <UserSetsFrom formName={FORM_NAME} onFinish={onFinish} />
    </Modal>
  );
};

const Connected = connector(AddRemoveSaveSetModal);

export default Connected;
