const carto = require('../utils/carto');

const zoningDistrict = async (string) => {
  const SQL = `
    SELECT DISTINCT zonedist
    FROM dcp_zoning_districts
    WHERE LOWER(zonedist) LIKE LOWER('%25${string.toLowerCase()}%25')
    ORDER BY zonedist ASC
    LIMIT 5
  `;

  try {
    const rows = await carto.SQL(SQL);
    return rows.map((row) => {
      row.label = row.zonedist;
      row.type = 'zoning-district';
      delete row.zonedist;
      return row;
    })
  } catch (error) {
    throw error
  }
};

module.exports = zoningDistrict;
