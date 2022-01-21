import { expect } from "chai";
import { combineControllers } from "pretty-express";
import "reflect-metadata";
import request from "supertest";
import { generateSampleApp } from "../demoApp";
import AuthDataController from "./controller/authDataController";
//
import { generateToken } from "./SimpleAuth";

describe("Auth data tests", () => {
  let app = generateSampleApp();
  before(() => {
    const router = combineControllers([new AuthDataController()]);
    app.use(router);
  });

  after(() => {
    app = undefined;
  });

  it("Verify AuthData sent by User as data in body using params decorator ", async () => {
    const token = generateToken({
      role: "admin",
    });
    const response = await request(app)
      .get("/authdata")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).to.have.keys("data");
    expect(response.body.data).to.have.keys("role", "iat");
    expect(response.body.data.role).to.be.equal("admin");
  });

  it("Verify AuthData sent by User as data in body using params decorator ", async () => {
    const token = generateToken({
      role: "admin",
    });
    const response = await request(app)
      .get("/authdata/test")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).to.have.keys("data");
    expect(response.body.data).to.have.keys("role", "iat");
    expect(response.body.data.role).to.be.equal("admin");
  });
});
