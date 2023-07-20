const carto = require("../utils/carto");

const zoningDistrict = async (string) => {
  const SQL = `
    SELECT DISTINCT sdname, cartodb_id
    FROM dcp_special_purpose_districts
    WHERE LOWER(sdname) LIKE LOWER('%25${string.toLowerCase()}%25')
    LIMIT 5
  `;

  try {
    const rows = await carto.SQL(SQL);
    return rows.map((row) => {
      row.label = row.sdname;
      row.type = "special-purpose-district";
      delete row.sdname;
      return row;
    });
  } catch (error) {
    throw new Error(
      `Failed to search special-purpose-district helper for string: ${string}. Failed with error: ${
        error.response?.statusText
          ? error.response?.statusText
          : "Internal server error"
      }`
    );
  }
};

module.exports = zoningDistrict;
