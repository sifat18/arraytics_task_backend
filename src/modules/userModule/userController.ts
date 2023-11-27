import { Request, RequestHandler, Response } from "express";
import {
  deleteUserService,
  getAllUserService,
  updateUserService,
} from "./userService";
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
// update
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await updateUserService(id, updatedData);

  reponseFormat<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});
// delete
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteUserService(id);

  reponseFormat<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
