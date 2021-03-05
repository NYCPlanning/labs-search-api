const rp = require('request-promise');

const geosearch = (string, req) => {
  const referer = req.header('Referer');
  const geoSearchAPICall =
   `https://geosearch.planninglabs.nyc/v1/autocomplete?boundary.rect.min_lon=-74.292297&boundary.rect.max_lon=-73.618011&boundary.rect.min_lat=40.477248&boundary.rect.max_lat=40.958123&text=${string}`;

  return rp(geoSearchAPICall, {
    headers: {
      'Referer': `labs-search-api--${referer}`, // eslint-disable-line
    },
  })
    .then(res => JSON.parse(res))
    .then(json => json.features.filter(feature => feature.properties.borough))
    .then(json => json.map((feature) => {
      const { label, pad_bbl: bbl } = feature.properties;
      const { geometry } = feature;

      return {
        label,
        bbl,
        geometry,
        type: 'lot',
      };
    }))
    .then(json => json.slice(0, 5)); // limit to first 5 results
};

module.exports = geosearch;
