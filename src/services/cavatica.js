import ajax from 'services/ajax';
import { cavaticaApiRoot } from 'common/injectGlobals';

// export const validateToken = async (t) => {
//   const validationService = axios.create({
//     baseURL: cavaticaApiRoot,
//     headers: {
//       'X-SBG-Auth-Token': t,
//       authorization: '',
//     },
//   });

//   const { data } = await validationService.get(`/user`);
//   return true && data;
// }

/** getUser
  Return object of form:
    {
      "href": "https://cavatica-api.sbgenomics.com/v2/users/jondev01",
      "username": "jondev01",
      "email": "jondev01@yopmail.com",
      "first_name": "Jon",
      "last_name": "Dev",
      "tags": [],
      "affiliation": "Developer",
      "phone": "",
      "address": "",
      "city": "",
      "state": "",
      "country": "United States",
      "zip_code": ""
    }
  */
export const getUser = async () => {
  return await ajax.post(cavaticaApiRoot,
    {
      path: '/user',
      method: 'GET',
    });
}

/**
Should return array of billing groups with the form:
  {
      "id": "864ca119-0298-4e0b-83e2-36861d3a5ace",
      "href": "https://cavatica-api.sbgenomics.com/v2/billing/groups/864ca119-0298-4e0b-83e2-36861d3a5ace",
      "name": "Pilot Funds"
  }
*/
export const getBillingGroups = async () => {
  const { items } = await ajax.post(cavaticaApiRoot,
    {
      path: '/billing/groups',
      method: 'GET',
    });
  return items;
}

/**
 * Return array of projects, each of the form:
    {
        "href": "https://cavatica-api.sbgenomics.com/v2/projects/username01/test-project",
        "id": "username01/test-project",
        "name": "test project"
    }
 */
export const getProjects = async () => {
  return await ajax.post(cavaticaApiRoot,
    {
      path: '/projects',
      method: 'GET',
    });
}

/**
 * Returns details of created project, or error:
  {
    "href": "https://cavatica-api.sbgenomics.com/v2/projects/username01/test-project",
    "id": "username01/test-project",
    "name": "test project",
    "type": "v2",
    "description": "test description",
    "tags": [],
    "settings": {
        "locked": false,
        "controlled": false,
        "use_interruptible_instances": false
    },
    "billing_group": "864ca119-0298-4e0b-83e2-36861d3a5ace"
  }
 * 
 */
export const createProject = async ({ name, billing_group, description = '' }) => {
  return await ajax.post(cavaticaApiRoot,
    {
      path: '/projects',
      method: 'GET',
      body: { name, billing_group, description },
    });
}

export const getFiles = async () => {
  return await ajax.post(cavaticaApiRoot,
    {
      path: '/files',
      method: 'GET',
    });
}

