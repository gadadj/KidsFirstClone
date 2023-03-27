import { gql } from '@apollo/client';

export const SEARCH_BIOSPECIMEN_QUERY = gql`
  query searchBiospecimen(
    $sqon: JSON
    $first: Int
    $offset: Int
    $sort: [Sort]
    $searchAfter: JSON
  ) {
    biospecimens {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            id
            sample_id
            container_id
            sample_type
            parent_sample_type
            age_at_biospecimen_collection
            ncit_anatomy_site_id
            anatomy_site
            ncit_id_tissue_type
            tissue_type_source_text
            consent_type
            diagnosis_mondo
            nb_files
            study {
              study_code
            }
            participant {
              participant_id
              external_id
            }
            files {
              hits {
                total
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PARTICIPANT_BIOSPECIMENS = gql`
  query searchParticipantBiospecimen($sqon: JSON) {
    biospecimens {
      hits(filters: $sqon) {
        total
        edges {
          node {
            id
            sample_id
            sample_type
            parent_sample_type
            age_at_biospecimen_collection
            ncit_anatomy_site_id
            anatomy_site
            ncit_id_tissue_type
            tissue_type_source_text
            consent_type

            participant {
              participant_id
            }

            parent_0 {
              sample_id
            }
          }
        }
      }
    }
  }
`;

export const GET_BIOSPECIMEN_COUNT = gql`
  query getBiospecimenCount($sqon: JSON) {
    biospecimens {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;

export const CHECK_BIOSPECIMEN_MATCH = gql`
  query fetchMatchBiospecimen($sqon: JSON, $first: Int, $offset: Int) {
    biospecimens {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            fhir_id
            sample_id
            study_id
            container_id
          }
        }
      }
    }
  }
`;

export const BIOSPECIMEN_SEARCH_BY_ID_QUERY = gql`
  query searchBiospecimenById($sqon: JSON) {
    biospecimens {
      hits(filters: $sqon) {
        edges {
          node {
            sample_id
            collection_sample_id
          }
        }
      }
    }
  }
`;
