import { Request, RequestHandler, Response } from "express";
import { getAllUserService } from "./userService";
import catchAsync from "../../shared/catchAsync";
import APIError from "../../errorHelpers/APIError";
import { pick, userFilterableFields } from "../../shared/pick";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "./userInterface";

// all user
export const getAllUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);

    const result = await getAllUserService(filters);

    reponseFormat<IUser[]>(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  }
);
