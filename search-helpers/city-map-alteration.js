const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const cityMapAmendment = (string) => {
  const SQL = `
    SELECT
      LOWER(substring(link_addre, '(?<=_All%5C%5C).*?(?=.pdf)')) as label,
      effective,
      ST_AsGeoJSON(the_geom) as geometry
    FROM citymap_amendments_v0
    WHERE
      effective IS NOT NULL AND
      LOWER(substring(link_addre, '(?<=_All%5C%5C).*?(?=.pdf)')) LIKE LOWER('%25${string.toUpperCase()}%25')
    LIMIT 5
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.geometry = JSON.parse(row.geometry);
      row.type = 'city-map-alteration';
      return row;
    }));
};

module.exports = cityMapAmendment;
