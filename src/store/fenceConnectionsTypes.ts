import { ThunkDispatch } from 'redux-thunk';

import { FenceName } from './fenceTypes';
import { RootState } from './rootState';
import { Nullable } from './utilityTypes';

export type Projects = { [index: string]: any };

export type Connection = {
  authz: { [index: string]: any };
  azp: Nullable<string>;
  certificates_uploaded: any[];
  display_name: Nullable<string>;
  email: Nullable<string>;
  groups: string[];
  is_admin: boolean;
  message: string;
  name: string;
  phone_number: Nullable<string>;
  preferred_username: Nullable<string>;
  primary_google_service_account: Nullable<string>;
  project_access: { [index: string]: any };
  projects: Projects;
  resources: any[];
  resources_granted: any[];
  role: string;
  sub: number;
  user_id: number;
  username: string;
};

export type FenceConnections = { [fenceName: string]: Connection };

export enum FenceConnectionsActions {
  requestFetchFenceConnections = 'requestFetchFenceConnections',
  fetchFenceConnections = 'fetchFenceConnections',
  failureFetchingFenceConnections = 'failureFetchingFenceConnections',
  toggleIsFetchingAllFenceConnections = 'toggleIsFetchingAllFenceConnections',
  addFenceConnection = 'addFenceConnection',
  requestFetchFenceStudies = 'requestFetchFenceStudies',
  fetchFenceStudies = 'fetchFenceStudies',
  failureFetchingFenceStudies = 'failureFetchingFenceStudies',
  removeFenceConnection = 'removeFenceConnection',
}

export type RequestFetchFenceStudiesAction = {
  type: FenceConnectionsActions.requestFetchFenceStudies;
};

export type FetchFenceStudiesAction = {
  type: FenceConnectionsActions.fetchFenceStudies;
};

export type FailureFetchingFenceStudiesAction = {
  type: FenceConnectionsActions.failureFetchingFenceStudies;
};

export type ToggleIsFetchingAllFenceConnectionsAction = {
  type: FenceConnectionsActions.toggleIsFetchingAllFenceConnections;
  isLoading: boolean;
};

export type AddFenceConnectionsAction = {
  type: FenceConnectionsActions.addFenceConnection;
  fenceName: FenceName;
  connection: Connection;
};

export type RequestFetchFenceConnectionsAction = {
  type: FenceConnectionsActions.requestFetchFenceConnections;
};

export type FetchFenceConnectionsAction = {
  type: FenceConnectionsActions.fetchFenceConnections;
};

export type FenceConnectionsState = {
  fenceConnections: { [fenceName: string]: Connection };
  isFetchingAllFenceConnections: boolean;
};

export type RemoveFenceConnection = {
  type: FenceConnectionsActions.removeFenceConnection;
  fenceName: FenceName;
};

export type FenceConnectionsActionTypes =
  | RequestFetchFenceConnectionsAction
  | FetchFenceConnectionsAction
  | AddFenceConnectionsAction
  | ToggleIsFetchingAllFenceConnectionsAction
  | RequestFetchFenceStudiesAction
  | FetchFenceStudiesAction
  | FailureFetchingFenceStudiesAction
  | RemoveFenceConnection;

export type DispatchFenceConnections = ThunkDispatch<RootState, null, FenceConnectionsActionTypes>;
