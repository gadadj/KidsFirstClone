import cloneDeep from 'lodash/cloneDeep';
import {
  getDefaultSqon,
  isDefaultSqon,
  addSetToActiveQuery,
  createNewQueryFromSetId,
} from 'common/sqonUtils';

import {
  LOGOUT,
  SET_ACTIVE_INDEX,
  SET_SQONS,
  SET_VIRTUAL_STUDY_ID,
  VIRTUAL_STUDY_CLEAN_ERROR,
  VIRTUAL_STUDY_DELETE_FAILURE,
  VIRTUAL_STUDY_DELETE_REQUESTED,
  VIRTUAL_STUDY_DELETE_SUCCESS,
  VIRTUAL_STUDY_LOAD_FAILURE,
  VIRTUAL_STUDY_LOAD_REQUESTED,
  VIRTUAL_STUDY_LOAD_SUCCESS,
  VIRTUAL_STUDY_RESET,
  VIRTUAL_STUDY_SAVE_FAILURE,
  VIRTUAL_STUDY_SAVE_REQUESTED,
  VIRTUAL_STUDY_SAVE_SUCCESS,
} from '../actionTypes';
import { CREATE_SET_QUERY_REQUEST, ADD_SET_TO_CURRENT_QUERY } from '../saveSetTypes';

export const initialState = {
  sqons: getDefaultSqon(),
  activeIndex: 0,
  uid: null,
  virtualStudyId: null,
  name: '',
  description: '',
  dirty: false,
  areSqonsEmpty: true,
  isLoading: false,
  error: null,
};

const currySetState = (state) => (diff = {}) => {
  const newState = { ...state, ...diff };
  newState.areSqonsEmpty = isDefaultSqon(newState.sqons);
  return newState;
};

const resetState = (diff = {}) => {
  const newState = {
    ...cloneDeep(initialState),
    ...diff,
  };
  newState.areSqonsEmpty = isDefaultSqon(newState.sqons);
  return newState;
};

export default (state = initialState, action) => {
  const setState = currySetState(state);
  switch (action.type) {
    case VIRTUAL_STUDY_LOAD_REQUESTED:
      return resetState({
        isLoading: true,
      });
    case VIRTUAL_STUDY_LOAD_SUCCESS:
      return resetState({
        ...action.payload,
        isLoading: false,
      });
    case VIRTUAL_STUDY_LOAD_FAILURE:
      return setState({
        error: action.payload,
        isLoading: false,
      });

    case VIRTUAL_STUDY_RESET:
      return resetState();

    case VIRTUAL_STUDY_SAVE_REQUESTED:
      return state;
    case VIRTUAL_STUDY_SAVE_SUCCESS:
      return setState({
        ...action.payload,
        dirty: false,
        areSqonsEmpty: false,
      });
    case VIRTUAL_STUDY_SAVE_FAILURE:
      return setState({
        error: action.payload,
      });

    case VIRTUAL_STUDY_DELETE_REQUESTED:
      return setState({
        isLoading: true,
      });
    case VIRTUAL_STUDY_DELETE_SUCCESS:
      return resetState();
    case VIRTUAL_STUDY_DELETE_FAILURE:
      return setState({
        error: action.payload,
        isLoading: false,
      });

    case SET_ACTIVE_INDEX:
      return setState({
        dirty: true,
        activeIndex: action.payload,
      });

    case SET_SQONS:
      return setState({
        dirty: true,
        sqons: action.payload,
      });

    case SET_VIRTUAL_STUDY_ID:
      return setState({
        dirty: true,
        virtualStudyId: action.payload,
      });

    case CREATE_SET_QUERY_REQUEST: {
      const newSqons = createNewQueryFromSetId(action.setId, state.sqons);
      return setState({
        sqons: newSqons,
        activeIndex: newSqons.length - 1,
      });
    }
    case LOGOUT:
      return cloneDeep(initialState);

    case VIRTUAL_STUDY_CLEAN_ERROR:
      return setState({
        error: null,
      });

    case ADD_SET_TO_CURRENT_QUERY: {
      const { activeIndex, sqons } = state;
      const newSqons = addSetToActiveQuery({
        setId: action.setId,
        querySqons: sqons,
        activeIndex,
      });
      return setState({ sqons: newSqons, activeIndex });
    }
    default:
      return state;
  }
};
