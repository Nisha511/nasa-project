const http = require("http");
const mangoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.models");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:TStGLbXHEKmMMnlZ@nasacluster.d5i79zr.mongodb.net/?retryWrites=true&w=majority";

const server = http.createServer(app);

mangoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mangoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mangoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    // useFindAndModify: false,//not supported
    // useCreateIndex: true,//not supported
    useUnifiedTopology: true,
  });
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}....`);
  });
}
startServer();
