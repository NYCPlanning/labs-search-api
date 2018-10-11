// const carto = require('../utils/carto');

const overlays = ['C1-1', 'C1-2', 'C1-3', 'C1-4', 'C1-5', 'C2-1', 'C2-2', 'C2-3', 'C2-4', 'C2-5'];

const commercialOverlay = (string) => {
  return new Promise((resolve) => {
    const matches = overlays.filter(overlay => overlay.toLowerCase().indexOf(string.toLowerCase()) !== -1);
    const results = matches.map(result => ({
      label: result,
      type: 'commercial-overlay',
    }));
    resolve(results);
  });
};

module.exports = commercialOverlay;
