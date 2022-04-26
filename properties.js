const shapefile = require("shapefile");

Promise.all([
  parseInput(),
  shapefile.read("build/cb_2021_us_cbsa_5m.shp"),
  shapefile.read("build/cb_2021_us_cd116_5m.shp"),
  shapefile.read("build/cb_2021_us_county_5m.shp"),
  shapefile.read("build/cb_2021_us_state_5m.shp")
]).then(output);

function parseInput() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin
        .on("data", chunk => chunks.push(chunk))
        .on("end", () => {
          try { resolve(JSON.parse(chunks.join(""))); }
          catch (error) { reject(error); }
        })
        .setEncoding("utf8");
  });
}

function output([topology, cbsa, cd, counties, states]) {
  cbsa = new Map(cbsa.features.map(d => [d.properties.GEOID, d.properties]));
  cd = new Map(cd.features.map(d => [d.properties.GEOID, d.properties]));
  counties = new Map(counties.features.map(d => [d.properties.GEOID, d.properties]));
  states = new Map(states.features.map(d => [d.properties.GEOID, d.properties]));
  for (const county of topology.objects.counties.geometries) {
    county.properties = {
      name: counties.get(county.id).NAME
    };
  }
  for (const state of topology.objects.states.geometries) {
    state.properties = {
      name: states.get(state.id).NAME
    };
  }
  process.stdout.write(JSON.stringify(topology));
  process.stdout.write("\n");
}
