const fs = require('fs');
const path = require('path');
const mapshaper = require('mapshaper');
const util = require('node:util')
const stream = require('stream');

async function convertShpToGeoJSON(shapefile){
  const outputDir = path.dirname(shapefile);
  const name = path.basename(shapefile, 'shp').replace(/cb_\d+_|tl_\d+_/, '');
  const topoJSONOutput = `${name}json`;
  await mapshaper.runCommands(`-i ${shapefile} -simplify dp 20% -o topojson/${topoJSONOutput} precision=0.00001 format=topojson`);
  return `${outputDir}/${topoJSONOutput}`;
}

module.exports = convertShpToGeoJSON;