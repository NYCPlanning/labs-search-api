const carto = require('../utils/carto');

const commercialOverlay = (string) => {
  const SQL = `
    SELECT DISTINCT overlay
    FROM commercial_overlays
    WHERE LOWER(overlay) LIKE LOWER('%25${string.toLowerCase()}%25')
    ORDER BY overlay ASC
    LIMIT 5
  `;

  return carto.SQL(SQL)
    .then(rows => rows.map((row) => {
      row.label = row.overlay;
      row.type = 'commercial-overlay';
      delete row.overlay;
      return row;
    }));
};

module.exports = commercialOverlay;
