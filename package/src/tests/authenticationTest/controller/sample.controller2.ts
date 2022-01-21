import { controller, get } from "pretty-express";
import { jwtAuth, authData } from "../SimpleAuth";


@jwtAuth("admin")
@controller("/controller-auth")
export default class SampleController {
        @get("/")
        asdasda(){
            return {}
        }
}
