const express = require('express');

const geoSearch = require('../search-helpers/geosearch');
const cityMapStreetSearch = require('../search-helpers/city-map-street-search');


const router = express.Router();

router.get('/', (req, res) => {
  const { q } = req.query;
  const cleanedString = q.replace('\'', '\'\'');

  // pass postgresql-friendly string to everything that's using carto
  // all others get the original string
  Promise.all([
    geoSearch(q),
    cityMapStreetSearch(cleanedString),
  ])
    .then((values) => {
      const [geosearch, streets] = values;
      const responseArray = [];
      res.json(responseArray.concat(geosearch, streets));
    }).catch((reason) => {
      console.error(reason); // eslint-disable-line
    });
});

module.exports = router;
