import { ThunkDispatch } from 'redux-thunk';

import { RootState } from './rootState';
import { Sqon } from './sqon';

export enum SetsActions {
  TOGGLE_PENDING_CREATE = 'TOGGLE_PENDING_CREATE_SAVE_SET',
  FAILURE_CREATE = 'FAILURE_CREATE_SAVE_SETS',
  RE_INITIALIZE_STATE = 'RE_INITIALIZE_SAVE_SET',
  TOGGLE_LOADING_SAVE_SETS = 'TOGGLE_LOADING_SAVE_SETS',
  USER_SAVE_SETS = 'USER_SAVE_SETS',
  FAILURE_LOAD_SAVE_SETS = 'FAILURE_LOAD_SAVE_SETS',
  TOGGLE_IS_DELETING_SAVE_SETS = 'TOGGLE_IS_DELETING_SAVE_SETS',
  TOGGLE_IS_ADD_DELETE_TO_SET = 'TOGGLE_IS_ADD_DELETE_TO_SET',
  REMOVE_USER_SAVE_SETS = 'REMOVE_USER_SAVE_SETS',
  EDIT_SAVE_SET_TAG = 'EDIT_SAVE_SET_TAG',
  CREATE_SET_QUERY_REQUEST = 'CREATE_QUERY_REQUEST',
  DELETE_SET_QUERY_REQUEST = 'DELETE_SET_QUERY_REQUEST',
  ADD_SET_TO_CURRENT_QUERY = 'ADD_SET_TO_CURRENT_QUERY',
}

export type SetInfo = {
  key: string;
  name: string;
  count?: number;
  currentUser: string;
};

export type AddRemoveSetParams = {
  userId: string;
  setId: string;
  onSuccess: Function;
  onFail: Function;
  subActionType: SetSubActionTypes;
  sqon: Sqon;
  type: string;
  path: string;
};

interface TogglePendingCreate {
  type: SetsActions.TOGGLE_PENDING_CREATE;
  isPending: boolean;
}

interface FailureCreate {
  type: SetsActions.FAILURE_CREATE;
  error: Error | null;
}

interface ReInitializedState {
  type: SetsActions.RE_INITIALIZE_STATE;
}

interface IsLoadingSaveSets {
  type: SetsActions.TOGGLE_LOADING_SAVE_SETS;
  isLoading: boolean;
}

interface DisplayUserSaveSets {
  type: SetsActions.USER_SAVE_SETS;
  payload: UserSet[];
}

interface FailureLoadSaveSets {
  type: SetsActions.FAILURE_LOAD_SAVE_SETS;
  error: Error | null;
}

interface IsDeletingSaveSets {
  type: SetsActions.TOGGLE_IS_DELETING_SAVE_SETS;
  isDeleting: boolean;
}

interface isAddingOrRemovingToSet {
  type: SetsActions.TOGGLE_IS_ADD_DELETE_TO_SET;
  isEditing: boolean;
}

interface RemoveUserSets {
  type: SetsActions.REMOVE_USER_SAVE_SETS;
  sets: string[];
}

interface EditSetTag {
  type: SetsActions.EDIT_SAVE_SET_TAG;
  set: SetInfo;
}

interface CreateQueryInCohortBuilder {
  type: SetsActions.CREATE_SET_QUERY_REQUEST;
  setId: string;
}

interface AddSetToCurrentQuery {
  type: SetsActions.ADD_SET_TO_CURRENT_QUERY;
  setId: string;
}

export type DispatchSaveSets = ThunkDispatch<RootState, null, SetsActionTypes>;

export type SetsActionTypes =
  | TogglePendingCreate
  | FailureCreate
  | ReInitializedState
  | IsLoadingSaveSets
  | DisplayUserSaveSets
  | IsDeletingSaveSets
  | RemoveUserSets
  | EditSetTag
  | isAddingOrRemovingToSet
  | FailureLoadSaveSets
  | CreateQueryInCohortBuilder
  | AddSetToCurrentQuery;

export type UserSet = {
  setId: string;
  size: number;
  tag: string;
};

export interface UserSetsState {
  isLoading: boolean;
  error?: Error | null;
  sets: UserSet[];
  isDeleting: boolean;
  isEditing: boolean;
}

export interface SaveSetState {
  create: {
    isLoading: boolean;
    error?: Error | null;
  };
  userSets: UserSetsState;
}

export type SaveSetParams = {
  tag: string;
  userId: string;
  sqon: Sqon;
  // sets: UserSaveSets[];
  onSuccess: Function;
  onNameConflict: Function;
};

export type EditSetTagParams = {
  setInfo: SetInfo;
  onSuccess: Function;
  onFail: Function;
  onNameConflict: Function;
};

export type DeleteSetParams = {
  setIds: string[];
  onFail: Function;
};

export class SetNameConflictError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SaveSetNameConflictError';
  }
}

export const isSaveSetNameConflictError = (e?: Error | null) => e instanceof SetNameConflictError;

export enum SaveSetActionsTypes {
  CREATE = 'create',
  EDIT = 'edit',
}

export enum SetSourceType {
  QUERY = 'QUERY',
  SAVE_SET = 'SAVE_SET',
}

export enum SetSubActionTypes {
  RENAME_TAG = 'RENAME_TAG',
  ADD_IDS = 'ADD_IDS',
  REMOVE_IDS = 'REMOVE_IDS',
}

export type SetUpdateSource = {
  sourceType: SetUpdateSource;
};

export type SetUpdateInputData = {
  type?: string;
  sqon?: Sqon;
  path?: string;
  newTag?: string;
};
