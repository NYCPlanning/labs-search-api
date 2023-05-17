const axios = require('axios')

const geosearchV2 = async (string, req, next) => {
  const referer = req.header('Referer');
  const geoSearchAPICall =
   `https://geosearch.planninglabs.nyc/v2/search?boundary.rect.min_lon=-74.292297&boundary.rect.max_lon=-73.618011&boundary.rect.min_lat=40.477248&boundary.rect.max_lat=40.958123&text=${string}`;
  return new Promise(async (resolve, reject) => {
    try {
     const response = await axios({
       method: 'get',
       url: geoSearchAPICall,
       headers: {
         'Referer': `labs-search-api--${referer}`
       }
     })
     const result = response.data.features.filter(feature => feature.properties.borough).map((feature) => {
       const { label, addendum: { pad: { bbl }} } = feature.properties;
       const { geometry } = feature;
       return {
         label,
         bbl,
         geometry,
         type: 'lot',
       };
     }).slice(0, 5)
     resolve(result)
   } catch (error) {
     reject(error.response?.statusText ? error.response?.statusText : "Internal server error")
   }
  })
};

module.exports = geosearchV2;
