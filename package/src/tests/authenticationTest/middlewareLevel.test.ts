import "reflect-metadata";
import { combineControllers } from "pretty-express";
import SampleController from "./controller/sample.controller";
import SampleController2 from "./controller/sample.controller2";
import request from "supertest";
import { expect } from "chai";
import { generateSampleApp } from "../demoApp";
//
import { generateToken } from "./SimpleAuth";
import NoAuthController from "./controller/NoAuthController";

describe("Authentication Decorator tests tests", () => {
  let app = generateSampleApp();
  before(() => {
    const router = combineControllers([
      new SampleController(),
      new SampleController2(),
      new NoAuthController(),
    ]);
    app.use(router);
  });

  after(() => {
    app = undefined;
  });
  it("send request to request middleware without token user. Must return 401", async () => {
    const response = await request(app)
      .get("/auth/user")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);
  });

  it("send request to request middleware WITH token user. Must pass", async () => {
    const token = generateToken({
      role: "user",
    });
    const response = await request(app)
      .get("/auth/user")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("send request to request middleware without token admin. Must return 401", async () => {
    const response = await request(app)
      .get("/auth/admin")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);
  });

  it("send request to request middleware WITH token admin. Must pass", async () => {
    const token = generateToken({
      role: "admin",
    });
    const response = await request(app)
      .get("/auth/admin")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("send request to no auth. Must Pass", async () => {
    const response = await request(app)
      .get("/auth/noauth")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("send request to no auth. on A different controller. Must Pass", async () => {
    const response = await request(app)
      .get("/noauth")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
