const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const zoningMapAmendment = async (string) => {
  const SQL = `
    SELECT
      project_na,
      status,
      ulurpno
    FROM dcp_zoning_map_amendments
    WHERE
      LOWER(project_na) LIKE LOWER('%25${string.toUpperCase()}%25') OR LOWER(ulurpno) LIKE LOWER('%25${string}%25')
    LIMIT 5
  `;

  try {
    const rows = await carto.SQL(SQL);
    return rows.map((row) => {
      row.label = row.project_na ? toTitleCase(row.project_na) : 'No Name';
      row.type = 'zma';
      delete row.project_na;
      return row;
    })
  } catch (error) {
    throw new Error(`Failed to search zoning-map-amendment helper for string: ${string}. Failed with error: ${error.response?.statusText ? error.response?.statusText : "Internal server error"}`)
  }
};

module.exports = zoningMapAmendment;
