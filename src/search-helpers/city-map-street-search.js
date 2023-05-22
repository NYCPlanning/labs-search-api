const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const cityMapStreetSearch = (string) => {
  const SQL = `
    SELECT official_s, boro_name, ST_AsGeoJson(ST_Envelope(ST_Union(the_geom))) AS bbox, ST_AsGeoJson(ST_LineMerge(ST_Union(the_geom))) AS the_geom
    FROM dcp_dcm_street_centerline
    WHERE
      LOWER(official_s) LIKE LOWER('%25${string}%25')
    GROUP BY boro_name, official_s
    LIMIT 5
  `;

  return carto.SQL(SQL)
    .then(rows => rows.map((row) => {
      row.the_geom = JSON.parse(row.the_geom);
      row.bbox = JSON.parse(row.bbox);
      row.label = toTitleCase(row.official_s);
      row.type = 'city-street';
      return row;
    }));
};

module.exports = cityMapStreetSearch;
