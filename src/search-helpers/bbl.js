const carto = require("../utils/carto");

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

const bbl = async (string) => {
  const tenDigits = string.match(/^\d{10,14}$/);

  const SQL = `
    SELECT (address || ', ' ||
      CASE
        WHEN borough = 'MN' THEN 'Manhattan'
        WHEN borough = 'BX' THEN 'Bronx'
        WHEN borough = 'BK' THEN 'Brooklyn'
        WHEN borough = 'QN' THEN 'Queens'
        WHEN borough = 'SI' THEN 'Staten Island'
      END) as address, bbl FROM dcp_mappluto
     WHERE bbl = ${string}
     LIMIT 5
  `;

  if (!tenDigits) return [];

  try {
    const rows = await carto.SQL(SQL);
    return rows.map((row) => {
      row.label = toTitleCase(row.address);
      row.type = "lot";
      delete row.address;
      return row;
    });
  } catch (error) {
    throw new Error(
      `Failed to search bbl helper for string: ${string}. Failed with error: ${
        error.response?.statusText
          ? error.response?.statusText
          : "Internal server error"
      }`
    );
  }
};

module.exports = bbl;
