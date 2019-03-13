import { get, isObject } from 'lodash';
import { getFenceUser } from 'services/fence';
import { graphql } from 'services/arranger';

const getStudyIdsFromSqon = api => ({ sqon }) =>
  graphql(api)({
    query: `
      query StudyIds($sqon: JSON) {
        file {
          aggregations (filters: $sqon, aggregations_filter_themselves: true){
            participants__study__external_id {
              buckets {
                key
              }
            }
          }
        }
      }
    `,
    variables: {
      sqon,
    },
  }).then(
    ({
      data: {
        file: {
          aggregations: {
            participants__study__external_id: { buckets },
          },
        },
      },
    }) => buckets.map(({ key }) => key),
  );

const getStudiesAggregationsFromSqon = api => studyIds => sqons =>
  !studyIds.length
    ? []
    : graphql(api)({
        query: `
          query AcceptedStudiesAggs(${studyIds.map(id => `$${id}_sqon: JSON`)}) {
            file {
              ${studyIds
                .map(
                  id => `
                  ${id}: aggregations (filters: $${id}_sqon, aggregations_filter_themselves: true){
                    latest_did { buckets { key } }
                    participants__study__name { buckets { key } }
                    participants__study__short_name { buckets { key } }
                  }
                `,
                )
                .join('')}
            }
          }
        `,
        variables: sqons,
      }).then(({ data: { file: aggregations } }) => {
        return studyIds.map(id => {
          const aggregation = aggregations[id];
          const {
            latest_did: { buckets: fileIds },
          } = aggregation;
          const {
            participants__study__name: { buckets: studyNames },
            participants__study__short_name: { buckets: studyShortNames },
          } = aggregation;
          return {
            id: id,
            files: fileIds,
            studyName: studyNames.map(({ key }) => key)[0],
            studyShortName: studyShortNames.map(({ key }) => key)[0],
          };
        });
      });

export const createStudyIdSqon = studyId => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.study.external_id',
        value: [studyId],
      },
    },
  ],
});

export const createAcceptedFilesByUserStudySqon = projects => ({ sqon, studyId }) => {
  const approvedAcls = projects.sort();
  return {
    op: 'and',
    content: [
      ...(sqon ? sqon.content : []),
      { op: 'in', content: { field: 'acl', value: approvedAcls } },
      { op: 'in', content: { field: 'participants.study.external_id', value: [studyId] } },
    ],
  };
};
const createUnacceptedFilesByUserStudySqon = projects => ({ studyId, sqon }) => {
  const approvedAcls = projects.sort();
  return {
    op: 'and',
    content: [
      ...(sqon ? sqon.content : []),
      { op: 'not', content: [{ op: 'in', content: { field: 'acl', value: approvedAcls } }] },
      { op: 'in', content: { field: 'participants.study.external_id', value: [studyId] } },
    ],
  };
};

export const getUserStudyPermission = (api, fenceConnections) => async ({
  sqon = {
    op: 'and',
    content: [],
  },
} = {}) => {
  const projects = [];
  Object.values(fenceConnections).forEach(fenceUser => {
    if (isObject(fenceUser.projects)) projects.push(...Object.keys(fenceUser.projects));
  });

  const approvedAcls = projects.sort();

  const [acceptedStudyIds, unacceptedStudyIds] = await Promise.all([
    getStudyIdsFromSqon(api)({
      sqon: {
        op: 'and',
        content: [
          ...sqon.content,
          {
            op: 'in',
            content: {
              field: 'acl',
              value: approvedAcls,
            },
          },
        ],
      },
    }),
    getStudyIdsFromSqon(api)({
      sqon: {
        op: 'and',
        content: [
          ...sqon.content,
          {
            op: 'not',
            content: [
              {
                op: 'in',
                content: {
                  field: 'acl',
                  value: approvedAcls,
                },
              },
            ],
          },
        ],
      },
    }),
  ]);

  const [acceptedStudiesAggs, unacceptedStudiesAggs] = await Promise.all([
    getStudiesAggregationsFromSqon(api)(acceptedStudyIds)(
      acceptedStudyIds.reduce((acc, id) => {
        acc[`${id}_sqon`] = createAcceptedFilesByUserStudySqon(projects)({
          studyId: id,
          sqon,
        });
        return acc;
      }, {}),
    ),
    getStudiesAggregationsFromSqon(api)(unacceptedStudyIds)(
      unacceptedStudyIds.reduce((acc, id) => {
        acc[`${id}_sqon`] = createUnacceptedFilesByUserStudySqon(projects)({
          studyId: id,
          sqon,
        });
        return acc;
      }, {}),
    ),
  ]);

  return { acceptedStudiesAggs, unacceptedStudiesAggs };
};

export const checkUserFilePermission = api => async ({ fileId, fence }) => {
  let userDetails;
  try {
    userDetails = await getFenceUser(api, fence);
  } catch (err) {
    return Promise.resolve(false);
  }

  const approvedAcls = Object.keys(userDetails.projects);

  return graphql(api)({
    query: `query ($sqon: JSON) {
      file {
        aggregations(filters: $sqon) {
          acl { buckets { key } }
        }
      }
    }`,
    variables: {
      sqon: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'kf_id',
              value: [fileId],
            },
          },
        ],
      },
    },
  })
    .then(data => {
      const fileAcl = get(data, 'data.file.aggregations.acl.buckets', []).map(({ key }) => key);
      return fileAcl.some(fileAcl => approvedAcls.includes(fileAcl));
    })
    .catch(err => {
      console.log('err', err);
      return false;
    });
};
