const express = require('express');
const search = require('./search');
const cityMapSearch = require('./city-map-search');

const router = express.Router();

router.use('/search', search);
router.use('/city-map-search', cityMapSearch);

module.exports = router;
