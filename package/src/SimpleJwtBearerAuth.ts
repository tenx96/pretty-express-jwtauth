import { ClassConstructor } from "class-transformer";
import { ValidatorOptions } from "class-validator";
import jwt from "jsonwebtoken";
import {
  createMiddlewareDecorator,
  createParamDecorator,
  NextFunction,
  Request,
  Response,
} from "pretty-express";
export abstract class SimpleJwtBearerAuth<
  DecoratorArgsType extends any[],
  PayloadType extends Object | string
> {
  constructor(
    private secret: string,
    private options?: {
      payloadPath?: string;
      defaultErrorMessage?: string;
    }
  ) {}

  abstract validatePayload(
    payload: PayloadType,
    decoratorArgs: DecoratorArgsType
  ): boolean;
  public onValidationError: (
    error: Error | String,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void = (error, req, res, next) => {
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message ||
            (this.options && this.options.defaultErrorMessage) ||
            "Authentication Failed"
          : error,
    });
  };

  public generateToken = (payload: PayloadType, options?: jwt.SignOptions) => {
    const token = jwt.sign(payload, this.secret, options);
    return token;
  };

  public generateTransferableAuthData = (
    payload: PayloadType,
    decoratorArgs: DecoratorArgsType
  ): any => {
    return payload;
  };

  public extractBearerToken = (req: Request) => {
    try {
      if (req.headers.authorization) {
        const strArr = req.headers.authorization.split(" ");

        if (strArr[0] === "Bearer") {
          return strArr[1];
        }
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  public validateTokenAndGetPayload = (token: string) => {
    return jwt.verify(token, this.secret) as PayloadType;
  };

  public decorators = {
    authData: createParamDecorator(
      (this.options && this.options.payloadPath) || "authUser"
    ),
    jwtAuth: createMiddlewareDecorator<DecoratorArgsType>((args) => {
      return this.jwtMiddlewareBuilder(args);
    }),
  };

  public jwtMiddlewareBuilder = (decoratorArgs: DecoratorArgsType) => {
    return (req: any, res: Response, next: NextFunction) => {
      const token = this.extractBearerToken(req);

      if (token) {
        try {
          const payload = this.validateTokenAndGetPayload(token);
          const isValid = this.validatePayload(payload, decoratorArgs);
          if (isValid) {
            const payloadPath =
              this.options && this.options.payloadPath
                ? this.options.payloadPath
                : "authUser";
            req[payloadPath] = this.generateTransferableAuthData(
              payload,
              decoratorArgs
            );

            next();
          } else {
            throw new Error("Error validation token");
          }
        } catch (err) {
          // validation error || use message
          this.onValidationError(err, req, res, next);
        }
      } else {
        // no token, handle auth
        this.onValidationError(
          "No auth token present in header",
          req,
          res,
          next
        );
      }
    };
  };
}
