require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app");
const { Users } = require("../../models/users");

mongoose.set("strictQuery", false);

const { HOST_TEST_URI } = process.env;

describe("signup", () => {
  beforeAll(async () => {
    await mongoose.connect(HOST_TEST_URI);

    await Users.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect(HOST_TEST_URI);
  });

  it("should signup new user", async () => {
    const response = await supertest(app).post("/api/auth/signup").send({
      email: "example@example.com",
      password: "examplepassword",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.user.email).toBe("testUser1@gmail.com");
  });

  it("should not signup the same user 2 times", async () => {
    await supertest(app).post("/api/auth/signup").send({
      email: "testUser2@gmail.com",
      password: "123456",
    });

    const response = await supertest(app).post("/api/auth/signup").send({
      email: "testUser2@gmail.com",
      password: "123456",
    });
    //
    expect(response.statusCode).toBe(409);
  });
});
