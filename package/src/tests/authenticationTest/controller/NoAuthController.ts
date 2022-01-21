import { controller, get } from "pretty-express";
import { jwtAuth, authData } from "../SimpleAuth";

@controller("/noauth")
export default class NoAuthController {
  @get("/")
  getUsers(req: any) {
    return { msg: "passed " };
  }
}
