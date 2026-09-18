// Escape a value for safe inclusion inside a single-quoted SQL string literal.
//
// The search helpers string-interpolate the user query into a `LIKE '%...%'`
// literal in the Carto SQL API request (the Carto SQL API takes a raw `q=`
// string and does not support bind parameters), so every single quote in the
// value must be doubled to keep it inside the literal.
//
// The previous sanitizer used `q.replace("'", "''")`. With a *string* first
// argument, `String.prototype.replace` only replaces the FIRST match, so a
// second single quote survived and terminated the literal. Using a global
// regex doubles every quote.
const escapeSqlLiteral = (value) => String(value).replace(/'/g, "''");

module.exports = { escapeSqlLiteral };
