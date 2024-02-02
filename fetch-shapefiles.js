const fs = require('fs');
const path = require('node:path');
const download = require('download');
const convertShpToGeoJSON = require('./shapefiles-to-geojson');

const YEAR = 2022;
const BASEURL = `https://www2.census.gov/geo/tiger/GENZ${YEAR}/shp/`;
const FILES = [
  `cb_${YEAR}_us_cd118_5m.zip`,
  `cb_${YEAR}_us_county_5m.zip`,
  `cb_${YEAR}_us_nation_5m.zip`,
  `cb_${YEAR}_us_sldl_500k.zip`,
  `cb_${YEAR}_us_sldu_500k.zip`,
  `cb_${YEAR}_us_state_5m.zip`
]

const requests = FILES.map( file => download(`${BASEURL}${file}`, 'shapefiles', {extract: true}).catch(console.warn));

year = 2023
cbsa = `https://www2.census.gov/geo/tiger/TIGER${year}/CBSA/tl_${year}_us_cbsa.zip`;
cbsa = download(cbsa, 'shapefiles', {extract: true}).catch(console.warn)
requests.push(cbsa)

Promise.all(requests)
.then(async function (){
  const downloadedArtifacts = await fs.promises.readdir("shapefiles");
  let shapefiles = downloadedArtifacts.filter(name => name.endsWith('shp')).map( f => path.resolve("shapefiles", f))
  console.log("All shapefiles downloaded: \n", shapefiles.join('\n'));
  Promise.allSettled( shapefiles.map( shp => convertShpToGeoJSON(shp) )  ).then((results) => console.log("Converted shapefiles to TopoJSON: \n", results.map( ({value}) => value).join('\n')))
})