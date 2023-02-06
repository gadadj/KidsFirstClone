import { gql } from '@apollo/client';

export const SEARCH_FILES_QUERY = gql`
  query searchFiles($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    files {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            id
            external_id
            fhir_id
            file_id
            data_category
            data_type
            file_format
            size
            controlled_access
            access_urls
            acl
            file_name
            repository
            nb_participants
            nb_biospecimens
            fhir_document_reference
            index {
              urls
              file_name
            }
            study {
              study_id
              study_name
              study_code
            }
            sequencing_experiment {
              hits {
                edges {
                  node {
                    experiment_strategy
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_FILE_ENTITY = gql`
  query getFileEntity($sqon: JSON) {
    files {
      hits(filters: $sqon) {
        edges {
          node {
            id
            access_urls
            controlled_access
            data_category
            data_type
            file_id
            file_name
            file_format
            is_harmonized
            hashes {
              etag
            }
            nb_biospecimens
            nb_participants
            sequencing_experiment {
              hits {
                edges {
                  node {
                    sequencing_experiment_id
                    experiment_strategy
                    experiment_date
                    library_name
                    library_strand
                    platform
                    instrument_model
                    external_id
                  }
                }
              }
            }
            size
            study {
              study_name
              study_code
            }
          }
        }
      }
    }
  }
`;

export const CHECK_FILE_MATCH = gql`
  query fetchMatchFile($sqon: JSON, $first: Int, $offset: Int) {
    files {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            fhir_id
            file_id
            study {
              study_id
            }
          }
        }
      }
    }
  }
`;

export const FILE_SEARCH_BY_ID_QUERY = gql`
  query searchFileById($sqon: JSON) {
    files {
      hits(filters: $sqon) {
        edges {
          node {
            file_id
          }
        }
      }
    }
  }
`;
