const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const launchData = {
    mission: "ZTM 1555",
    rocket: "ZTM Experimental 554",
    target: "Kepler-1865 f",
    launchDate: "January 10, 2028",
  };

  const launchDataInvalidDate = {
    mission: "ZTM 1555",
    rocket: "ZTM Experimental 554",
    target: "Kepler-1865 f",
    launchDate: "zoot",
  };

  const launchDataNoDate = {
    mission: "ZTM 1555",
    rocket: "ZTM Experimental 554",
    target: "Kepler-1865 f",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(launchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataNoDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataNoDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
