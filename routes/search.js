const express = require('express');
const searchHelpers = require('../search-helpers');
const { camelize } = require('underscore.string');

const router = express.Router();

router.get('/', (req, res) => {
  const { q, helpers } = req.query;
  const cleanedString = q.replace('\'', '\'\'');

  // execute promises for each of the passed-in search helpers
  const promises = helpers.map((helper) => {
    const camelizedHelperName = camelize(helper);
    const search_helper = searchHelpers[camelizedHelperName];

    return search_helper(cleanedString);
  });

  // TODO if no helpers are specified in query params, execute ALL of them

  // Promise.all
  Promise.all(promises)
    .then((values) => {
      // merge the results of all of the promises into a single array of objects
      const merged = [].concat(...values);
      res.json(merged); // send it back to the client
    }).catch((reason) => {
      console.error(reason); // eslint-disable-line
    });
});

router.get('/:search_helper', (req, res) => {
  const { params: { search_helper: searchHelper } } = req;
  const camelizedHelperName = camelize(searchHelper);
  const search_helper = searchHelpers[camelizedHelperName];

  if (!search_helper) {
    res.status(500).send({ error: 'Search helper does not exist' });
  } else {
    const { q } = req.query;
    const cleanedString = q.replace('\'', '\'\'');

    search_helper(cleanedString).then((data) => {
      res.json(data);
    });
  }
});

module.exports = router;
