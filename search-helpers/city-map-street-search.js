const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const cityMapStreetSearch = (string) => {
  const SQL = `
    SELECT official_s, ST_AsGeoJson(ST_Union(the_geom)) AS the_geom 
    FROM citymap_streetcenterlines_v0
    WHERE
      LOWER(official_s) LIKE LOWER('%25${string}%25')
    GROUP BY boro_name, official_s
    LIMIT 5
  `;

  return carto.SQL(SQL)
    .then(rows => rows.map((row) => {
      row.the_geom = JSON.parse(row.the_geom);
      row.label = toTitleCase(row.official_s);
      row.type = 'city-street';
      return row;
    }));
};

module.exports = cityMapStreetSearch;
