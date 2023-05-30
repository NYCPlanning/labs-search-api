const carto = require("../utils/carto");

const commercialOverlay = async (string) => {
  const SQL = `
    SELECT DISTINCT overlay
    FROM dcp_commercial_overlays
    WHERE LOWER(overlay) LIKE LOWER('%25${string.toLowerCase()}%25')
    ORDER BY overlay ASC
    LIMIT 5
  `;

  try {
    const rows = await carto.SQL(SQL);
    return rows.map((row) => {
      row.label = row.overlay;
      row.type = "commercial-overlay";
      delete row.overlay;
      return row;
    });
  } catch (error) {
    throw new Error(
      `Failed to search commercial-overlay helper for string: ${string}. Failed with error: ${
        error.response?.statusText
          ? error.response?.statusText
          : "Internal server error"
      }`
    );
  }
};

module.exports = commercialOverlay;
