import { useSelector } from 'react-redux';
import { singularizeSetTypeIfNeeded } from 'views/DataExploration/components/SetsManagementDropdown';

import { SetType } from 'services/api/savedSet/models';

import EnvironmentVariables from '../../helpers/EnvVariables';
import { BIOSPECIMENS_SAVED_SETS_FIELD } from '../../views/DataExploration/utils/constant';
import { VARIANT_SAVED_SETS_FIELD } from '../../views/Variants/utils/constants';

import { savedSetSelector } from './selector';

export type { initialState as SavedSetInitialState } from './types';
export { default, SavedSetState } from './slice';

export const MAX_LENGTH_NAME = 50;
export const getSetFieldId = (type: SetType) => {
  if (type === SetType.VARIANT) {
    return VARIANT_SAVED_SETS_FIELD;
  }

  if (type === SetType.BIOSPECIMEN_REQUEST || type === SetType.BIOSPECIMEN) {
    return BIOSPECIMENS_SAVED_SETS_FIELD;
  }

  if (type === SetType.FILE) {
    return `${singularizeSetTypeIfNeeded(type)}_facet_ids.${singularizeSetTypeIfNeeded(
      type,
    )}_fhir_id_1`;
  }

  return `${type}_facet_ids.${type}_fhir_id_1`;
};
export const PROJECT_ID = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');

export const useSavedSet = () => useSelector(savedSetSelector);
