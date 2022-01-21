import "reflect-metadata";
import express from "express";
import { combineControllers } from "pretty-express";
import { SampleController ,SampleController2} from "./SampleController";
import { generateToken } from "./SimpleAuth";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = combineControllers([new SampleController(), new SampleController2()]);

app.use(router);
const userToken = generateToken(
  { role: "user" },
  {
    expiresIn: "1hr",
  }
);

const adminToken = generateToken(
  { role: "admin" },
  {
    expiresIn: "1hr",
  }
);
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
  console.log("TEST TOKEN USER: ",userToken)
  console.log("TEST TOKEN ADMIN: ",adminToken)
});
