import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import HeaderBanner from 'components/UserProfile/HeaderBanner';
import { cleanProfileErrors, toggleIsActive, toggleIsPublic } from 'store/actionCreators/profile';
import {
  selectErrorIsToggleProfileStatus,
  selectIsLoadingProfileStatus,
  selectProfile,
} from 'store/selectors/profile';

import { getMsgFromAccessError } from './utils';

const HeaderBannerContainer = (props) => {
  const {
    isLoading,
    error,
    profile,
    canEdit,
    isAdmin,
    onCleanErrors,
    onToggleIsPublic,
    onToggleIsActive,
  } = props;
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: getMsgFromAccessError(error, 'An error occurred while updating the profile'),
        duration: 10, //[sec]
        onClose: () => onCleanErrors(),
      });
    }
  }, [error, onCleanErrors]);

  return (
    <HeaderBanner
      onChangePrivacyStatusCb={() =>
        onToggleIsPublic({
          ...profile,
          ...{ isPublic: !profile.isPublic },
        })
      }
      onChangeActivityStatusCb={() =>
        onToggleIsActive({
          ...profile,
          ...{ isActive: !profile.isActive },
        })
      }
      profile={profile}
      isLoading={isLoading}
      error={error}
      canEdit={canEdit}
      isAdmin={isAdmin}
    />
  );
};

HeaderBannerContainer.propTypes = {
  /** we must always have a non empty profile here */
  profile: PropTypes.object,
  onToggleIsPublic: PropTypes.func.isRequired,
  onToggleIsActive: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onCleanErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: selectProfile(state),
  isLoading: selectIsLoadingProfileStatus(state),
  error: selectErrorIsToggleProfileStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  onToggleIsPublic: (profile) => dispatch(toggleIsPublic(profile)),
  onToggleIsActive: (profile) => dispatch(toggleIsActive(profile)),
  onCleanErrors: () => dispatch(cleanProfileErrors()),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(HeaderBannerContainer);
