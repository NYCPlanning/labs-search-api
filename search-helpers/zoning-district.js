const carto = require('../utils/carto');

const zoningDistrict = (string) => {
  const SQL = `
    SELECT DISTINCT zonedist
    FROM zoning_districts_v201710
    WHERE LOWER(zonedist) LIKE LOWER('%25${string.toLowerCase()}%25')
    LIMIT 5
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.label = row.zonedist;
      row.type = 'zoning-district';
      delete row.zonedist;
      return row;
    }));
};

module.exports = zoningDistrict;
