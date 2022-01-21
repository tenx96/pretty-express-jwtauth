import { controller, get } from "pretty-express";
import { jwtAuth, authData } from "../SimpleAuth";

@controller("/auth")
export default class SampleController {
  @jwtAuth("user")
  @get("/user")
  getUsers(@authData authData: any, req: any) {
    return { msg: "passed middleware leval auth ", data: authData };
  }

  @jwtAuth("admin")
  @get("/admin")
  getAdmins(@authData authData: any, req: any) {
    return { msg: "passed middleware leval auth ", data: authData };
  }

  @get("/noauth")
  asdasd(@authData authData: any, req: any) {
    return { msg: "passed middleware leval auth ", data: authData };
  }
}



