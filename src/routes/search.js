const express = require("express");
const searchHelpers = require("../search-helpers");
const { camelize } = require("underscore.string");

const router = express.Router();

// get several search types by passing in a helpers[] query param
router.get("/", async (req, res, next) => {
  const { q } = req.query;
  let { helpers } = req.query; // optional

  const cleanedString = q.replace("'", "''");

  // if no helpers param was passed, return only geosearch-v2 results
  if (!helpers) helpers = ["geosearch-v2"];

  const promises = helpers.map((helper) => {
    const camelizedHelperName = camelize(helper);
    const search_helper = searchHelpers[camelizedHelperName];

    return search_helper(cleanedString, req);
  });

  try {
    // Call helpers in parallel then flatten results into one array
    const results = await Promise.all(promises);
    res.json(results.flat());
  } catch (error) {
    // If any helpers throw an error,
    // pass error up to Express error handling middleware
    next(error);
  }
});

// get a single type of search results by name
router.get("/:search_helper", (req, res) => {
  const {
    params: { search_helper: searchHelper },
  } = req;
  const camelizedHelperName = camelize(searchHelper);
  const search_helper = searchHelpers[camelizedHelperName];

  if (!search_helper) {
    res.status(500).send({ error: "Search helper does not exist" });
  } else {
    const { q } = req.query;
    const cleanedString = q.replace("'", "''");

    search_helper(cleanedString, req).then((data) => {
      res.json(data);
    });
  }
});

module.exports = router;
