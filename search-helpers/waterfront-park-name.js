const carto = require('../utils/carto');

const waterfrontParkName = (string) => {
  const SQL = `
    SELECT paws_name, description, adjacent_waterway, location
    FROM pawsmastertable
    WHERE LOWER(paws_name) LIKE LOWER('%25${string.toLowerCase()}%25')
    ORDER BY paws_name ASC
    LIMIT 5
    LEFT JOIN
    (SELECT ST_AsGeoJSON(the_geom) as the_geom, paws_id
    FROM wpaas_v201810)
    ON paws_id = paws_id
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.the_geom = JSON.parse(row.the_geom);
      row.type = 'waterfront-park-name';
      return row;
    }));
};

module.exports = waterfrontParkName;
