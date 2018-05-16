const express = require('express');
const searchHelpers = require('../search-helpers');
const { camelize } = require('underscore.string');

const router = express.Router();

const {
  geoSearch,
  neighborhood,
  bbl,
  cityMapAlteration,
  zoningDistrict,
  zoningMapAmendment,
  specialPurposeDistrict,
  commercialOverlay,
} = searchHelpers;

router.get('/', (req, res) => {
  const { q } = req.query;
  const cleanedString = q.replace('\'', '\'\'');

  // pass postgresql-friendly string to everything that's using carto
  // all others get the original string
  Promise.all([
    geoSearch(q),
    neighborhood(cleanedString),
    bbl(cleanedString),
    cityMapAlteration(cleanedString),
    zoningDistrict(cleanedString),
    zoningMapAmendment(cleanedString),
    specialPurposeDistrict(cleanedString),
    commercialOverlay(q),
  ])
    .then((values) => {
      const [geosearch, neighborhoods, lots, zoningDistricts, zmas, spdistricts, commercialOverlayResults] = values;
      const responseArray = [];
      res.json(responseArray.concat(geosearch, neighborhoods, lots, zoningDistricts, zmas, spdistricts, commercialOverlayResults));
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
