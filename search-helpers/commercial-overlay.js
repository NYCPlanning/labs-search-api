const carto = require('../utils/carto');

const commercialOverlay = (string) => {
  const SQL = `
    SELECT DISTINCT overlay, cartodb_id
    FROM support_zoning_co
    WHERE LOWER(overlay) LIKE LOWER('%25${string.toLowerCase()}%25')
    LIMIT 5
  `;

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.label = row.overlay;
      row.type = 'commercial-overlay';
      return row;
    }));
};

module.exports = commercialOverlay;
