import { provideState } from 'freactal';
import { isArray, pick, without, chain, omit } from 'lodash';
import { addHeaders } from '@arranger/components';
import { setToken } from 'services/ajax';
import { updateProfile, getAllFieldNamesPromise } from 'services/profiles';
import { SERVICES } from 'common/constants';
import { handleJWT, validateJWT } from 'components/Login';
import {
  addStateInfo as addUsersnapInfo,
  addLoggedInUser as setUsersnapUser,
} from 'services/usersnap';
import {
  TRACKING_EVENTS,
  trackUserSession,
  trackUserInteraction,
} from 'services/analyticsTracking';
import { initializeApi } from 'services/api';
import history from 'services/history';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loginProvider: null,
    isLoadingUser: true,
    loggedInUserToken: '',
    percentageFilled: 0,
    integrationTokens: {},
  }),
  effects: {
    initialize: effects => state => {
      const { setToken, setUser } = effects;
      const provider = localStorage.getItem('LOGIN_PROVIDER');
      const jwt = localStorage.getItem('EGO_JWT');
      const api = initializeApi({
        onError: err => {
          history.push('/error');
        },
        onUnauthorized: response => {
          window.location.reload();
        },
      });
      if (validateJWT({ jwt })) {
        handleJWT({ provider, jwt, setToken, setUser, api });
        // Get all integration keys from local storage
        SERVICES.forEach(service => {
          const storedToken = localStorage.getItem(`integration_${service}`);
          if (storedToken) {
            state.integrationTokens[service] = storedToken;
          }
        });
        return { ...state, isLoadingUser: true };
      }
      return { ...state, isLoadingUser: false };
    },
    setUser: (effects, { api, ...user }) => {
      return getAllFieldNamesPromise(api)
        .then(({ data }) => {
          return chain(data)
            .get('__type.fields', [])
            .map(f => f.name)
            .without('sets')
            .value();
        })
        .then(fields => state => {
          const userRole = user.roles ? user.roles[0] : null;
          const userRoleProfileFields =
            userRole && userRole !== 'research'
              ? without(fields, 'institution', 'jobTitle')
              : fields;
          const profile = pick(omit(user, 'sets'), userRoleProfileFields);
          const filledFields = Object.values(profile || {}).filter(
            v => (isArray(v) && v.length) || (!isArray(v) && v),
          );
          const percentageFilled = filledFields.length / userRoleProfileFields.length;
          if (state.loggedInUser && state.percentageFilled < 1 && percentageFilled >= 1) {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.user.profile,
              action: TRACKING_EVENTS.actions.completedProfile,
              label: user.roles[0],
            });
          }
          addUsersnapInfo({ percentageFilled });
          setUsersnapUser(user);
          trackUserSession(user);
          return {
            ...state,
            isLoadingUser: false,
            loggedInUser: user,
            percentageFilled,
          };
        })
        .catch(err => console.log(err));
    },
    addUserSet: (effects, { api, ...set }) => state => {
      const { loggedInUser: { email, sets, ...rest } } = state;
      updateProfile(api)({
        user: {
          ...rest,
          sets: [...(sets || []), set],
        },
      }).then(profile => effects.setUser({ ...profile, email, api }));
    },
    setToken: (effects, { token, provider } = {}) => state => {
      setToken(token);
      if (token) {
        localStorage.setItem('LOGIN_PROVIDER', provider);
        localStorage.setItem('EGO_JWT', token);
        addHeaders({ authorization: `Bearer ${token}` });
      } else {
        localStorage.removeItem('LOGIN_PROVIDER');
        localStorage.removeItem('EGO_JWT');
        addHeaders({ authorization: '' });
      }
      addUsersnapInfo({ loggedInUserToken_exist: !!token });
      return { ...state, loggedInUserToken: token, loginProvider: provider };
    },
    setIntegrationToken: (effects, service, token) => state => {
      if (SERVICES.includes(service)) {
        const tokenKey = `integration_${service}`;
        if (token) {
          localStorage.setItem(tokenKey, token);
          state.integrationTokens[service] = token;
        } else {
          localStorage.removeItem(tokenKey);
          delete state.integrationTokens[service];
        }
      }
      return { ...state, integrationTokens: { ...state.integrationTokens } };
    },
    getIntegrationToken: (effects, service) => state => {
      if (SERVICES.includes(service)) {
        const tokenKey = `integration_${service}`;
        return tokenKey ? localStorage.getItem(tokenKey) : null;
      }
    },
    clearIntegrationTokens: effects => state => {
      SERVICES.forEach(service => localStorage.removeItem(`integration_${service}`));
      return { ...state, integrationTokens: {} };
    },
  },
});
