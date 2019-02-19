const carto = require('../utils/carto');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const zoningMapAmendment = (string) => {
  const SQL = `
    SELECT
      project_na,
      status,
      ulurpno
    FROM zoning_map_amendments
    WHERE
      LOWER(project_na) LIKE LOWER('%25${string.toUpperCase()}%25') OR LOWER(ulurpno) LIKE LOWER('%25${string}%25')
    LIMIT 5
  `;

  return carto.SQL(SQL).then((rows) => {
    if (rows.length > 0) {
      rows.map((row) => {
        row.label = row.project_na ? toTitleCase(row.project_na) : 'No Name';
        row.type = 'zma';
        delete row.project_na;
        return row;
      });
    }
  });
};

module.exports = zoningMapAmendment;
