const carto = require('../utils/carto');

const waterfrontParkName = (string) => {
  const SQL = `
    SELECT park_name, ST_AsGeoJSON(the_geom) as the_geom
    FROM wpaas_v201810
    WHERE LOWER(park_name) LIKE LOWER('%25${string.toLowerCase()}%25')
    ORDER BY park_name ASC
    LIMIT 5
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.the_geom = JSON.parse(row.the_geom);
      row.type = 'waterfront-park-name';
      return row;
    }));
};

module.exports = waterfrontParkName;
