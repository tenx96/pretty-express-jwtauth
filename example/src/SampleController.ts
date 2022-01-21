import { controller, get } from "pretty-express";
import { jwtAuth, authData } from "./SimpleAuth";

@controller("/")
@jwtAuth("admin")
export class SampleController {
  @jwtAuth("user")
  @get("/auth")
  getUsers(@authData authData : any, req : any) {

    console.log("REQ : " , req.someData)

    return { msg: "Hello world" , data : authData};
  }


  @get("/test")
  test(@authData authData : any, req : any) {

    console.log("Payload from req : REQ : " , req.someData)

    return { msg: "Hello world" , data : authData};
  }
}




@jwtAuth("user")
@controller("/admin")
export class SampleController2 {
  @jwtAuth("user")
  @get("/auth")
  getUsers(@authData authData: any, req: any) {
    return { msg: "passed middleware leval auth ", data: authData };
  }

  @jwtAuth("user")
  @get("/")
  getAdmins(@authData authData: any, req: any) {
    return { msg: "passed middleware leval auth ", data: authData };
  }


  @get("/class")
  passClass(@authData authData : any){
    return { msg: "passed class level auth", data: authData };
  }
}
