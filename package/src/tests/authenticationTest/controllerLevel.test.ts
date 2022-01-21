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

describe("Controller level auth tests", () => {
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
  it("send request to class middleware without token user. Must return 401", async () => {
    const response = await request(app)
      .get("/controller-auth")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);
  });


  it("send request to class middleware WITH token user. Must Pass", async () => {
    
    const token = generateToken({
      role : "admin"
    })
    const response = await request(app)
      .get("/controller-auth")
      .set("Accept", "application/json")
      .set("Authorization" ,  `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  
});
