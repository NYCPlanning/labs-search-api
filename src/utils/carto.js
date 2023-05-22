const axios = require('axios')

const cartoDomain = 'planninglabs.carto.com';

const buildSqlUrl = (cleanedQuery, type = 'json') => { // eslint-disable-line
  return `https://${cartoDomain}/api/v2/sql?q=${cleanedQuery}&format=${type}`;
};

const Carto = {
  SQL: async (query, type = 'json')=> {
    const cleanedQuery = query.replace('\n', '');
    const url = buildSqlUrl(cleanedQuery, type);

    try {
      const response = await axios({
        method: 'get',
        url,
      })
      // Return rows object for json queries and return full geojson feature collection for geojson queries
      return type === 'json' ? response.data.rows : response.data;
    } catch (error) {
      throw error.response?.statusText ? error.response?.statusText : "Internal server error"
    }
  },
};

module.exports = Carto;
