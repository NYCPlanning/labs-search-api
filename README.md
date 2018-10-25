[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-search-api/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-search-api/tree/develop)

# zola-search-api
An express.js api that combines mapzen search results with carto database results, providing autcomplete search for [ZoLa](https://zola.planning.nyc.government).  

## Requirements

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with NPM)

## Local development

- Clone this repo `https://github.com/NYCPlanning/labs-zola-search-api.git`
- Install Dependencies `yarn`
- Start the server `npm run devstart`

## Architecture

### Routes

- `/search` - gets results that match a string passed in as query parameter `q`
- e.g. localhost:4000/search/waterfront-park-name?q=esplanade

### Types of results

Results in will be JSON objects and will be one of the following types:

`address` - Mapzen Search geocoder results that matched the input string

`lot` - A PLUTO tax lot that matched either on `bbl` or `address`

`zma` - A zoning amendment that matched either on `ulurpno` or `project_na`

`neighborhood` - Neighborhoods (from NYC Neighborhood Tabulation Areas) that match the input string.

`zoningdistrict` - Zoning districts that match the input string.

`specialpurposedistrict` - Special Purpose Districts whose name matches the input string

`commercialoverlay` - Commercial Overlays that match the input string.

## Backend services

- **Carto** - Carto instance with MapPLUTO and other Zoning-related datasets
- **mapzen search api** - Mapzen autocomplete search results

## Testing and checks

- **ESLint** - We use ESLint with Airbnb's rules for JavaScript projects
  - Add an ESLint plugin to your text editor to highlight broken rules while you code
  - You can also run `eslint` at the command line with the `--fix` flag to automatically fix some errors.

## Deployment

Create dokku remote: `git remote add dokku dokku@{dokkudomain}:zola-api`
Deploy: `git push dokku master`

## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)
