const path = require("path");
const chai = require("chai");

const { expect } = chai;

// Count single quotes; an odd count inside the emitted SQL means the user value
// terminated the surrounding `LIKE '...'` literal (a breakout).
const quoteCount = (s) => (s.match(/'/g) || []).length;

// Stub src/utils/carto.js in the require cache so requiring a search helper never
// pulls in axios and NO request leaves the process. The stub captures the SQL the
// helper hands to Carto so we can assert on it. LOCAL ONLY — Carto is never contacted.
const captured = { sql: null };
const cartoPath = require.resolve("../../utils/carto");
require.cache[cartoPath] = {
  id: cartoPath,
  filename: cartoPath,
  loaded: true,
  exports: {
    SQL: async (query) => {
      captured.sql = query;
      return [];
    },
  },
};

// The real route sanitizer (post-fix) and a real interpolating helper.
const { escapeSqlLiteral } = require("../../utils/sql");
const zoningDistrict = require("../../search-helpers/zoning-district");

// The pre-fix sanitizer, kept here only to prove the test can tell fixed from broken.
const oldSanitize = (q) => q.replace("'", "''");

// Run a value through: route sanitizer -> real helper -> captured emitted SQL.
const emittedSqlFor = async (rawInput, sanitize) => {
  captured.sql = null;
  await zoningDistrict(sanitize(rawInput));
  return captured.sql;
};

describe("search: SQL single-quote escaping (CWE-89 regression)", () => {
  describe("escapeSqlLiteral()", () => {
    it("doubles EVERY single quote, not just the first", () => {
      expect(escapeSqlLiteral("a'b'c")).to.equal("a''b''c");
      expect(escapeSqlLiteral("R6' OR '1'='1")).to.equal("R6'' OR ''1''=''1");
    });

    it("leaves quote-free values unchanged", () => {
      expect(escapeSqlLiteral("R6")).to.equal("R6");
    });
  });

  describe("emitted Carto SQL is never broken out of", () => {
    // Payloads with an odd number of quotes are exactly what breaks the literal
    // when only the first quote is escaped.
    const breakoutPayloads = ["R6' OR '1'='1", "a'b'c", "x') OR 1=1 --"];

    breakoutPayloads.forEach((payload) => {
      it(`neutralizes ${JSON.stringify(payload)} (balanced quotes)`, async () => {
        const sql = await emittedSqlFor(payload, escapeSqlLiteral);
        // Every quote the value contributed is doubled, so the total number of
        // single quotes in the emitted SQL is even -> the LIKE literal is closed
        // by the helper's own quote, not by the user value.
        expect(quoteCount(sql) % 2).to.equal(0);
        // And the injected tail stays inside the literal as data, not as SQL.
        expect(sql).to.contain("LIKE LOWER('%25");
      });
    });

    it("control-test: the pre-fix sanitizer DID leave a breakout (odd quotes)", async () => {
      // Proves the assertion above is not vacuously true: the same payload run
      // through the old `q.replace("'", "''")` produces an odd, breaking count.
      const sql = await emittedSqlFor("R6' OR '1'='1", oldSanitize);
      expect(quoteCount(sql) % 2).to.equal(1);
    });
  });

  describe("legitimate autocomplete is unaffected", () => {
    it("passes a plain query through as a LIKE pattern", async () => {
      const sql = await emittedSqlFor("R6", escapeSqlLiteral);
      expect(sql).to.contain("LIKE LOWER('%25r6%25')");
      expect(quoteCount(sql) % 2).to.equal(0);
    });

    it("matches a name containing an apostrophe as data (e.g. O'Brien)", async () => {
      const sql = await emittedSqlFor("O'Brien", escapeSqlLiteral);
      // The apostrophe is doubled and stays inside the literal; nothing breaks out.
      expect(sql).to.contain("LIKE LOWER('%25o''brien%25')");
      expect(quoteCount(sql) % 2).to.equal(0);
    });
  });
});

// Silence an unused-path lint if this file is linted in isolation.
module.exports = { quoteCount, path };
