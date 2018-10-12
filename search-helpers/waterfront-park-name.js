const carto = require('../utils/carto');

const waterfrontParkName = (string) => {
  const SQL = `
    SELECT paws_name, paws_id, description, adjacent_waterway, location
    FROM pawsmastertable
    WHERE LOWER(paws_name) LIKE LOWER('%25${string.toLowerCase()}%25')
      OR LOWER(description) LIKE LOWER('%25${string.toLowerCase()}%25')
      OR LOWER(adjacent_waterway) LIKE LOWER('%25${string.toLowerCase()}%25')
      OR LOWER(location) LIKE LOWER('%25${string.toLowerCase()}%25')
  `;

  console.log(SQL);

  return carto.SQL(SQL).then(rows =>
    rows.map((row) => {
      row.label = row.paws_name;
      row.type = 'waterfront-park-name';
      return row;
    }));
};

module.exports = waterfrontParkName;
