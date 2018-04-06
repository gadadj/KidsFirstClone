import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import { Trans } from 'react-i18next';
import { googleLogin, facebookLogin } from 'services/login';
import FacebookLogin from 'components/loginButtons/FacebookLogin';
import RedirectLogin from 'components/loginButtons/RedirectLogin';

import { getProfile, createProfile } from 'services/profiles';
import { egoApiRoot } from 'common/injectGlobals';
import { allRedirectUris } from '../common/injectGlobals';
import { GEN3, CAVATICA } from 'common/constants';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { getSecret } from 'services/secrets';
import googleSDK from 'services/googleSDK';

const styles = {
  container: css`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding-bottom: 10px;
  `,
  googleSignin: css`
    margin-top: 0;
    margin-bottom: 10px;
  `,
};

const enhance = compose(injectState, withRouter);

export const handleJWT = async ({ jwt, onFinish, setToken, setUser }) => {
  const data = jwtDecode(jwt);
  const user = data.context.user;
  const egoId = data.sub;
  await setToken(jwt);
  const existingProfile = await getProfile({ egoId });
  const newProfile = !existingProfile ? await createProfile({ ...user, egoId }) : {};
  const loggedInUser = {
    ...(existingProfile || newProfile),
    email: user.email,
  };
  await setUser(loggedInUser);
  if (onFinish) {
    onFinish(loggedInUser);
  }
};

/**
 * fetchIntegrationTokens
 * For all SERVICES listed in common/constants, call the key-store to retrieve any keys stored
 *  for the user.
 * Each call to key-store is resolved separately and asynchronously. Their value will be added
 *  to state once returned.
 */
export const fetchIntegrationTokens = ({ setIntegrationToken }) => {
  getCavaticaUser()
    .then(userData => {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
    })
    .catch(response => {
      // Could not retrieve cavatica user info, nothing to do.
    });

  // Get Gen3 Secret here
  getSecret({ service: GEN3 })
    .then(data => {
      setIntegrationToken(GEN3, JSON.stringify(data));
    })
    .catch(res => {
      console.error('Error getting Gen3 API Key');
      console.error(res);
    });
};

class Component extends React.Component<any, any> {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
  };
  state = {
    securityError: false,
  };
  async componentDidMount() {
    try {
      await googleSDK();
      global.gapi.signin2.render('googleSignin', {
        scope: 'profile email',
        width: 240,
        height: 40,
        longtitle: true,
        theme: 'light',
        onsuccess: googleUser => {
          const { id_token } = googleUser.getAuthResponse();
          this.handleGoogleToken(id_token);
        },
        onfailure: error => global.log('login fail', error),
      });
    } catch (e) {
      global.log(e);
    }
  }
  onFacebookLogin = response => {
    this.handleFacebookToken(response.authResponse.accessToken);
  };
  handleFacebookToken = async token => {
    const response = await facebookLogin(token).catch(error => {
      if (error.message === 'Network Error') {
        this.handleSecurityError();
      }
    });

    if (response) {
      this.handleLoginResponse(response);
    }
  };
  handleGoogleToken = async token => {
    const response = await googleLogin(token).catch(error => {
      if (error.message === 'Network Error') {
        this.handleSecurityError();
      }
    });

    if (response) {
      this.handleLoginResponse(response);
    }
  };
  handleLoginResponse = async response => {
    if (response.status === 200) {
      const jwt = response.data;
      const props = this.props;
      const { onFinish, effects: { setToken, setUser, setIntegrationToken } } = props;
      await handleJWT({ jwt, onFinish, setToken, setUser });
      fetchIntegrationTokens({ setIntegrationToken });
    } else {
      console.warn('response error');
    }
  };

  handleSecurityError() {
    this.setState({
      securityError: true,
    });
  }

  render() {
    const renderSocialLoginButtons =
      this.props.shouldNotRedirect || allRedirectUris.includes(window.location.origin);

    return (
      <div className={styles.container}>
        {this.state.securityError ? (
          <div style={{ maxWidth: 600 }}>
            <Trans i18nKey="login.connectionFailed">
              Connection to ego failed, you may need to visit
              <a target="_blank" href={egoApiRoot}>
                {{ egoApiRoot }}
              </a>
              in a new tab and accept the warning
            </Trans>
          </div>
        ) : renderSocialLoginButtons ? (
          [
            <div key="google" className={styles.googleSignin} id="googleSignin" />,
            <FacebookLogin key="facebook" onLogin={this.onFacebookLogin} />,
          ]
        ) : (
          <RedirectLogin onLogin={({ token }) => this.handleJWT(token)} />
        )}
      </div>
    );
  }
}

export default enhance(Component);
