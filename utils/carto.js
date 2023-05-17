const axios = require('axios')

const cartoDomain = 'planninglabs.carto.com';

const buildSqlUrl = (cleanedQuery, type = 'json') => { // eslint-disable-line
  return `https://${cartoDomain}/api/v2/sql?q=${cleanedQuery}&format=${type}`;
};

const Carto = {
  SQL(query, type = 'json') {
    const cleanedQuery = query.replace('\n', '');
    const url = buildSqlUrl(cleanedQuery, type);

    return new Promise(async (resolve, reject) => {
      try {
       const response = await axios({
         method: 'get',
         url,
       })
       resolve(response.data)
     } catch (error) {
       reject(error.response?.statusText ? error.response?.statusText : "Internal server error")
     }
    })
  },
};

module.exports = Carto;
