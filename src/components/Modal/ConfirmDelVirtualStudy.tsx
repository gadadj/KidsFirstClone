/* eslint-disable react/prop-types */
import { deleteVirtualStudy, cleanError } from 'store/actionCreators/virtualStudies';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/rootState';
import React, { FunctionComponent, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { selectCurrentVSError, selectICurrentVSLoading } from 'store/selectors/currentStudy';
import { VirtualStudy } from 'store/virtualStudiesTypes';
import { selectLoggedInUser } from 'store/selectors/users';

const mapState = (state: RootState) => ({
  isLoading: selectICurrentVSLoading(state),
  error: selectCurrentVSError(state),
  loggedInUser: selectLoggedInUser(state),
});

const mapDispatch = {
  deleteVirtualStudy,
  cleanError,
};

const connector = connect(mapState, mapDispatch);

type OwnProps = {
  virtualStudy: VirtualStudy;
  onCloseCb: Function;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const ConfirmDelVirtualStudy: FunctionComponent<Props> = (props) => {
  const {
    isLoading,
    error,
    cleanError,
    onCloseCb,
    deleteVirtualStudy,
    virtualStudy,
    loggedInUser,
  } = props;

  useEffect(() => {
    if (error) {
      Modal.warning({
        title: 'An error may have prevented us from deleting your study',
        content: `Please try again. If your study cannot be deleted, contact us for assistance.`,
      });
    }
  }, [error]);

  useEffect(
    () =>
      function cleanup() {
        error && cleanError();
      },
  );

  return (
    <Modal
      closable={false}
      visible
      title={`Delete Virtual Study`}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCloseCb();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          disabled={isLoading}
          loading={isLoading}
          onClick={async () => {
            const { virtualStudyId } = virtualStudy;
            await deleteVirtualStudy({ virtualStudyId, loggedInUser });
            onCloseCb();
          }}
        >
          Delete
        </Button>,
      ]}
    >
      Are you sure you want to delete this study {virtualStudy.name ? `(${virtualStudy.name})` : ''}
      ?
      <br />
      <br />
      This action cannot be undone.
    </Modal>
  );
};

const Connected = connector(ConfirmDelVirtualStudy);

export default Connected;
