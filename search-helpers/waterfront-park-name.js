const carto = require('../utils/carto');

const waterfrontParkName = (string) => {
  const SQL = `
    SELECT name, summary_of, paws_id
    FROM wpaas_v201810
    WHERE LOWER(name) LIKE LOWER('%25${string.toLowerCase()}%25')
      OR LOWER(summary_of) LIKE LOWER('%25${string.toLowerCase()}%25')
  `;
  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.label = row.name;
      row.type = 'waterfront-park-name';
      return row;
    }));
};

module.exports = waterfrontParkName;
