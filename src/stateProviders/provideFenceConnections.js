import { provideState, update } from 'freactal';

import { getFenceUser } from 'services/fence';
import { getUserStudyPermission } from 'services/fileAccessControl';
import { FENCES } from 'common/constants';
import { omit, flatMap, isEmpty } from 'lodash';

export default provideState({
  initialState: props => ({
    fenceConnectionsInitialized: false,
    fenceConnections: {},

    fenceStudiesInitialized: false,
    fenceStudies: {},
  }),
  computed: {
    fenceAuthStudies: ({ fenceStudies }) =>
      !isEmpty(fenceStudies)
        ? flatMap(Object.values(fenceStudies), studies => studies.authorizedStudies)
        : [],
    fenceNonAuthStudies: ({ fenceStudies }) =>
      !isEmpty(fenceStudies)
        ? flatMap(Object.values(fenceStudies), studies => studies.unauthorizedStudies)
        : [],
  },
  effects: {
    setFenceConnectionsInitialized: update(state => ({
      fenceConnectionsInitialized: true,
    })),

    clearFenceConnections: update((state, fence) => ({
      fenceConnections: {},
      fenceStudies: {},
    })),
    addFenceConnection: update((state, { fence, details }) => {
      return {
        fenceConnections: { ...state.fenceConnections, [fence]: details },
      };
    }),
    removeFenceConnection: update((state, fence) => ({
      fenceConnections: omit(state.fenceConnections, fence),
      fenceStudies: omit(state.fenceStudies, fence),
      fenceStudiesInitialized: false,
    })),
    fetchFenceConnections: (effects, { api }) => {
      const fenceConnectionsFetchArray = FENCES.map(fence =>
        getFenceUser(api, fence)
          .then(details => {
            effects.addFenceConnection({ fence, details });
          })
          .catch(err => console.log(`Error fetching fence connection for '${fence}': ${err}`)),
      );

      return Promise.all(fenceConnectionsFetchArray).then(() => {
        effects.setFenceConnectionsInitialized();
        effects.setFenceStudiesInitialized(false);
      });
    },

    setFenceStudiesInitialized: update((state, initialized) => ({
      fenceStudiesInitialized: initialized,
    })),
    clearFenceStudies: update(state => ({
      fenceStudies: {},
      fenceStudiesInitialized: false,
    })),
    addFenceStudies: update(
      (state, fence, { authorizedStudies = [], unauthorizedStudies = [] }) => ({
        fenceStudies: {
          ...state.fenceStudies,
          [fence]: { authorizedStudies, unauthorizedStudies },
        },
      }),
    ),
    fetchFenceStudies: (effects, { api, fenceConnections }) => {
      effects.clearFenceStudies().then(() => {
        const fenceStudiesFetchArray = Object.keys(fenceConnections).map(fence =>
          getUserStudyPermission(api, { [fence]: fenceConnections[fence] })({})
            .then(({ acceptedStudiesAggs, unacceptedStudiesAggs }) => {
              effects.addFenceStudies(fence, {
                authorizedStudies: acceptedStudiesAggs,
                unauthorizedStudies: unacceptedStudiesAggs,
              });
            })
            .catch(err => console.log(`Error fetching fence studies for '${fence}': ${err}`)),
        );

        return Promise.all(fenceStudiesFetchArray).then(values => {
          effects.setFenceStudiesInitialized(true);
        });
      });
    },
  },
});
