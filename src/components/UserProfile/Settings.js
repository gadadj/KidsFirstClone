import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout, Row } from 'antd';
import PropTypes from 'prop-types';

import DeleteAccount from 'components/UserProfile/DeleteAccount';
import { clearClusterError } from 'store/actionCreators/workBench';
import { selectUser } from 'store/selectors/users';

import { SHOW_DELETE_ACCOUNT } from '../../common/constants';

import ApplicationIntegration from './ApplicationIntegration';
import ConnectionProvider from './ConnectionProvider';
import RepositoryIntegration from './RepositoryIntegration';

const mapDispatch = (dispatch) => ({
  onClearClusterError: () => dispatch(clearClusterError()),
});

const mapStateToProps = (state) => ({
  user: selectUser(state),
});

const { Content } = Layout;

const connector = connect(mapStateToProps, mapDispatch);

const Settings = (props) => {
  const { userEmail, onClearClusterError } = props;

  useEffect(() => {
    onClearClusterError();
  }, [onClearClusterError]);

  return (
    <Layout className={'settings-layout'}>
      <Content>
        <Row className={'settings-row-but-last'}>
          <ConnectionProvider userEmail={userEmail} />
        </Row>
        <Row className={'settings-row-but-last'}>
          <RepositoryIntegration />
        </Row>
        <Row className={'settings-row-but-last'}>
          <ApplicationIntegration />
        </Row>
        {localStorage.getItem(SHOW_DELETE_ACCOUNT) && (
          <Row>
            <DeleteAccount />
          </Row>
        )}
      </Content>
    </Layout>
  );
};

Settings.propTypes = {
  userEmail: PropTypes.string.isRequired,
  onClearClusterError: PropTypes.func.isRequired,
};

export default connector(Settings);
