const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function format(ntaname, string) {
  const nabes = ntaname.split('-');
  return toTitleCase(nabes.filter(nabe => nabe.toLowerCase().indexOf(string.toLowerCase()) !== -1)[0]);
}

const neighborhood = async (string) => {
  const SQL = `
    SELECT
      ST_Centroid(the_geom_webmercator) as the_geom,
      nta2020 as ntacode,
      ntaname
    FROM dcp_nta_2020
    WHERE
      LOWER(ntaname) LIKE LOWER('%25${string}%25')
      AND ntaname NOT ILIKE 'park-cemetery-etc%25'
    LIMIT 5
  `;

  try {
    const featureCollection = await carto.SQL(SQL, 'geojson')
    return featureCollection.features.map((feature) => {
      const { geometry, properties } = feature;
      return {
        label: format(properties.ntaname, string),
        coordinates: geometry.coordinates,
        type: 'neighborhood',
      };
    });
  } catch (error) {
    throw new Error(`Failed to search neighborhood helper for string: ${string}. Failed with error: ${error.response?.statusText ? error.response?.statusText : "Internal server error"}`)
  }
};

module.exports = neighborhood;
