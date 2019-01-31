const carto = require('../utils/carto');

// function toTitleCase(str) {
// return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// }

const cityMapAlteration = (string) => {
  const SQL = `
    SELECT
      LOWER(substring(link_addre, '(?<=_All%5C%5C).*?(?=.pdf)')) as label,
      effective,
      ST_AsGeoJSON(the_geom) as the_geom
    FROM citymap_amendments_v3
    WHERE
      effective IS NOT NULL AND
      LOWER(substring(link_addre, '(?<=_All%5C%5C).*?(?=.pdf)')) LIKE LOWER('%25${string.toUpperCase()}%25')
    LIMIT 5
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.the_geom = JSON.parse(row.the_geom);
      row.type = 'city-map-alteration';
      return row;
    }));
};

module.exports = cityMapAlteration;
