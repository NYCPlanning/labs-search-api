const axios = require("axios");

const geosearchV2 = async (string, req) => {
  const referer = req.header("Referer");
  const geoSearchAPICall = `https://geosearch.planninglabs.nyc/v2/search?boundary.rect.min_lon=-74.292297&boundary.rect.max_lon=-73.618011&boundary.rect.min_lat=40.477248&boundary.rect.max_lat=40.958123&text=${string}`;
  try {
    const response = await axios({
      method: "get",
      url: geoSearchAPICall,
      headers: {
        Referer: `labs-search-api--${referer}`,
      },
    });
    return response.data.features
      .filter((feature) => feature.properties.borough)
      .map((feature) => {
        const {
          label,
          addendum: {
            pad: { bbl },
          },
        } = feature.properties;
        const { geometry } = feature;
        return {
          label,
          bbl,
          geometry,
          type: "lot",
        };
      })
      .slice(0, 5);
  } catch (error) {
    throw new Error(
      `Failed to search geosearch-v2 helper for string: ${string}. Failed with error: ${
        error.response?.statusText
          ? error.response?.statusText
          : "Internal server error"
      }`
    );
  }
};

module.exports = geosearchV2;
