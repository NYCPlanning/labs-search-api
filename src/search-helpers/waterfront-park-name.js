const carto = require('../utils/carto');

const waterfrontParkName = async (string) => {
  const SQL = `
    SELECT name, summary, wpaa_id
    FROM wpaas_v202205
    WHERE LOWER(name) LIKE LOWER('%25${string.toLowerCase()}%25')
      OR LOWER(summary) LIKE LOWER('%25${string.toLowerCase()}%25')
  `;

  try {
    const rows = await carto.SQL(SQL)
    return rows.map((row) => {
      row.label = row.name;
      row.type = 'waterfront-park-name';
      return row;
    })
  } catch (error) {
    throw error
  }
};

module.exports = waterfrontParkName;
