const request = require("supertest");
const app = require("../../app");

describe("Test GET/launches", () => {
  test("It should response with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST launches", () => {
  const completeLaunchData = {
    mission: "USS Enterprize",
    rocket: "NCC 1701-10",
    target: "kepler-186 f",
    launchDates: "januart 4, 2023",
  };
  const completeLaunchWithoutDate = {
    mission: "USS Enterprize",
    rocket: "NCC 1701-10",
    target: "kepler-186 f",
  };
  const launchDataWthInvalidDate = {
    mission: "USS Enterprize",
    rocket: "NCC 1701-10",
    target: "kepler-186 f",
    launchDates: "zoot",
  };
  test("It should response with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDates).valueOf();
    const responseDate = new Date(response.body.launchDates).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(completeLaunchWithoutDate);
  });
  test("It should catch missing require properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });
  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWthInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
