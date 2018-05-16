const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const cityMapAmendment = (string) => {
  const SQL = `
    SELECT
      app_num,
      ST_AsGeoJSON(the_geom) as geometry
    FROM citymap_amendments_v0
    WHERE
      LOWER(app_num) LIKE LOWER('%25${string.toUpperCase()}%25')
    LIMIT 5
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.label = toTitleCase(row.app_num);
      row.geometry = JSON.parse(row.geometry);
      row.type = 'city-map-alteration';
      return row;
    }));
};

module.exports = cityMapAmendment;
