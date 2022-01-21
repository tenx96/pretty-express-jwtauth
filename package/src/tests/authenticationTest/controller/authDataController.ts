import { controller, get } from "pretty-express";
import { jwtAuth, authData } from "../SimpleAuth";

@jwtAuth("admin")
@controller("/authdata")
export default class AuthDataController {
  @get("/")
  test(@authData data: any) {
    return { data };
  }

  @get("/test")
  test2(req :  any) {
    return { data : req.someData};
  }
}
