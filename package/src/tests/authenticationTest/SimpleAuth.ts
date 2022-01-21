import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { SimpleJwtBearerAuth } from "../../";
import { ParsedQs } from "qs";

export type IJwtPayloadType = {
  role: string;
};

type IDecoratorArgs = [role: string];

class SimpleAuth extends SimpleJwtBearerAuth<IDecoratorArgs, IJwtPayloadType> {
  constructor(secret: string) {
    super(secret, {
      payloadPath: "someData",
    });
  }

  validatePayload(
    payload: IJwtPayloadType,
    decoratorArgs: IDecoratorArgs
  ): boolean {
    if (payload.role === decoratorArgs[0]) {
      return true;
    }
    throw new Error("Authentication failed. Invalid role");
  }
  
}

const authService = new SimpleAuth("secret");

export const jwtAuth = authService.decorators.jwtAuth;
export const authData = authService.decorators.authData;
export const generateToken = authService.generateToken;
