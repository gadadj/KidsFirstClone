export enum STATIC_ROUTES {
  HOME = '/',
  LOGIN = '/login',
  REGISTRATION = '/registration',
  TERMSCONDITONS = '/terms-and-conditions',
  AUTH_REDIRECT = '/auth-redirect',
  DASHBOARD = '/dashboard',
  STUDIES = '/studies',
  PROFILE_SETTINGS = '/profile/settings',
  PROFILE_VIEW = '/profile/view',
  COMMUNITY = '/community',
  ERROR = '/error',

  DATA_EXPLORATION = '/data-exploration',
  DATA_EXPLORATION_SUMMARY = '/data-exploration/summary',
  DATA_EXPLORATION_PARTICIPANTS = '/data-exploration/participants',
  DATA_EXPLORATION_BIOSPECIMENS = '/data-exploration/biospecimens',
  DATA_EXPLORATION_DATAFILES = '/data-exploration/datafiles',

  PARTICIPANT_ENTITY = '/data-exploration/participants',

  VARIANTS = '/variants',
  FILES = '/files',

  DCF_FENCE_REDIRECT = '/dcf_redirect',
  GEN3_FENCE_REDIRECT = '/gen3_redirect',
  CAVATICA_FENCE_REDIRECT = '/cavatica_redirect',

  FAKE_STORYBOOK = '/v2/temp/fake/storybook',
}

export enum DYNAMIC_ROUTES {
  DATA_EXPLORATION = '/data-exploration/:tab?',
  VARIANT_ENTITY = '/variants/:locus?',
  FILE_ENTITY = '/files/:file_id?',
  PARTICIPANT_ENTITY = '/data-exploration/participants/:id',
  STUDY_ENTITY = '/study/:study_id?',
  ERROR = '/error/:status?',
  COMMUNITY_MEMBER = '/member/:id',
}
