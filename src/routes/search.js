const express = require('express');
const searchHelpers = require('../search-helpers');
const { camelize } = require('underscore.string');

const router = express.Router();

// get several search types by passing in a helpers[] query param
router.get('/', async (req, res, next) => {
  const { q } = req.query;
  let { helpers } = req.query; // optional

  const cleanedString = q.replace('\'', '\'\'');

  // if no helpers param was passed, return only geosearch-v2 results
  if (!helpers) helpers = ['geosearch-v2'];

  try {
    let merged = []
    // Loop through each helper, calling the corresponding async function
    // and merging in results
    for (const helper of helpers) {
      const camelizedHelperName = camelize(helper);
      const search_helper = searchHelpers[camelizedHelperName];
      const result = await search_helper(cleanedString, req)
      merged = merged.concat(result)
    }
    res.json(merged);
  } catch (error) {
    // If any helpers throw an error, return the error
    // instead of results
    next(error)
  }
});

// get a single type of search results by name
router.get('/:search_helper', (req, res) => {
  const { params: { search_helper: searchHelper } } = req;
  const camelizedHelperName = camelize(searchHelper);
  const search_helper = searchHelpers[camelizedHelperName];

  if (!search_helper) {
    res.status(500).send({ error: 'Search helper does not exist' });
  } else {
    const { q } = req.query;
    const cleanedString = q.replace('\'', '\'\'');

    search_helper(cleanedString, req).then((data) => {
      res.json(data);
    });
  }
});

module.exports = router;
