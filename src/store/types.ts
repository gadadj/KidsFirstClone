import { GlobalInitialState } from 'store/global';
import { UserInitialState } from 'store/user';
import { PersonaInitialState } from 'store/persona';
import { FenceConnectionInitialState } from 'store/fenceConnection';
import { SavedFilterInitialState } from './savedFilter';
import { SavedSetInitialState } from './savedSet';
import { ReportInitialState } from './report';
import { FenceCavaticaInitialState } from './fenceCavatica';
import { fenceStudiesInitialState } from './fenceStudies';

export type RootState = {
  global: GlobalInitialState;
  user: UserInitialState;
  persona: PersonaInitialState;
  report: ReportInitialState;
  fenceConnection: FenceConnectionInitialState;
  fenceStudies: fenceStudiesInitialState;
  savedFilter: SavedFilterInitialState;
  savedSet: SavedSetInitialState;
  fenceCavatica: FenceCavaticaInitialState;
};
