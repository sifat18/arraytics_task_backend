import { Request, RequestHandler, Response } from "express";
import { createUserService, loginUserService } from "./authService";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "../userModule/userInterface";
import { ILoginUserResponse } from "../../config/interfaces/login";

// signup
export const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await createUserService(userData);
    let dataWithoutPass;
    if (result) {
      const { password, ...rest } = (result as any)?._doc;
      dataWithoutPass = rest;
    }
    reponseFormat<Omit<IUser, "password">>(res, {
      success: true,
      statusCode: 200,
      message: "User created successfully !",
      data: dataWithoutPass,
    });
  }
);
// login
export const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await loginUserService(userData);
    const { refreshToken, ...others } = result;
    // set refresh token into cookie

    const cookieOptions = {
      secure: true,
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    reponseFormat<ILoginUserResponse>(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully !",
      data: others,
    });
  }
);
