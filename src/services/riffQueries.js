import urlJoin from 'url-join';
import sqonToName from 'common/sqonToName';
import { shortUrlApi } from 'common/injectGlobals';

export default ({
  stats,
  queryName,
  sqon,
  loggedInUser,
  api,
  url,
  sharedPublicly = false,
  example = false,
}) => {
  console.log('ciaran');
  console.log('query name', queryName);
  console.log('stats', stats);
  console.log('alias', alias);
  console.log('url', window.location.href);
  console.log('api', api);
  console.log('logged user', loggedInUser);
  let { Files, Participants, Families, Size } = stats;
  let alias = queryName || sqonToName({ filters: sqon });

  return api({
    url: urlJoin(shortUrlApi, 'shorten'),
    body: JSON.stringify({
      userid: (loggedInUser || {}).egoId || 'anonymous',
      alias,
      sharedPublicly,
      content: {
        ...stats,
        example: example,
        longUrl: url,
        'og:title': `Kids First: ${alias}`,
        'og:description': `${Files} Files, ${Participants} Participants, ${Families} Families, ${Size} Size`,
        'og:image':
          'https://d3b.center/wp-content/uploads/2018/01/Kids-First-Hero-image-01-2-2000x500.png',
        'twitter:label1': 'Test Label',
        'twitter:data1': 'test data',
      },
    }),
  });
};
