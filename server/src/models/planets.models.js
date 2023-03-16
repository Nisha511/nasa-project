// const planets = [];

// module.exports = planets
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");
const { rejects } = require("assert");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function ishabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, rejects) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        //insert + update = upsert
        if (ishabitable(data)) {
          savePLanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        rejects(err);
      })
      .on("end", async () => {
        const countPlanetFound = (await getAllPlanets()).length;
        console.log(`${countPlanetFound} is Habitable planets found !!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePLanet(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
