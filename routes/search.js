const express = require('express');

const mapzen = require('../search-helpers/mapzen');
const neighborhood = require('../search-helpers/neighborhood');
const pluto = require('../search-helpers/pluto');
const zoningDistrict = require('../search-helpers/zoning-district');
const zoningMapAmendment = require('../search-helpers/zoning-map-amendment');
const specialPurposeDistrict = require('../search-helpers/special-purpose-district');
const commercialOverlay = require('../search-helpers/commercial-overlay');

const router = express.Router();

router.get('/', (req, res) => {
  const { q } = req.query;

  Promise.all([
    mapzen(q),
    neighborhood(q),
    pluto(q),
    zoningDistrict(q),
    zoningMapAmendment(q),
    specialPurposeDistrict(q),
    commercialOverlay(q),
  ])
    .then((values) => {
      const [addresses, neighborhoods, lots, zoningDistricts, zmas, spdistricts, commercialOverlay] = values;
      const responseArray = [];
      res.json(responseArray.concat(addresses, neighborhoods, lots, zoningDistricts, zmas, spdistricts, commercialOverlay));
    }).catch((reason) => {
      console.error(reason); // eslint-disable-line
    });
});

module.exports = router;
