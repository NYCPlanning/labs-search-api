const rp = require('request-promise');

const cartoUser = 'data';
const cartoDomain = 'planninglabs.carto.com';

const buildTemplate = (layergroupid, type) => { // eslint-disable-line
  return `https://${cartoDomain}/api/v1/map/${layergroupid}/{z}/{x}/{y}.${type}`;
};

const buildSqlUrl = (cleanedQuery, type = 'json') => { // eslint-disable-line
  return `https://${cartoDomain}/api/v2/sql?q=${cleanedQuery}&format=${type}`;
};

const Carto = {
  SQL(query, type = 'json') {
    const cleanedQuery = query.replace('\n', '');
    const url = buildSqlUrl(cleanedQuery, type);

    return rp({
      uri: url,
      resolveWithFullResponse: true,
      time: true,
    })
      .then((response) => {
        console.log(`Carto API call completed in ${response.elapsedTime}ms`);
        const obj = JSON.parse(response.body);
        return obj.rows ? obj.rows : obj;
        // throw new Error('Not found');
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
};

module.exports = Carto;
