import mongoose, { SortOrder } from "mongoose";
import { IUser, IUserFilters } from "./userInterface";
import { User } from "./userModel";
import bcrypt from "bcrypt";
import config from "../../config";
import { userSearchableFields } from "../../shared/pick";
import APIError from "../../errorHelpers/APIError";

// getting all
export const getAllUserService = async (
  filters: IUserFilters
): Promise<IUser[]> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  // search
  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  // filter field
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $or: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          $regex: value,
          $options: "i",
        },
      })),
    });
  }
  const sortConditions: { [key: string]: SortOrder } = {};

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions).sort(sortConditions);

  return result;
};

// update
export const updateUserService = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ Id: id });

  if (!isExist) {
    throw new APIError(404, "User not found !");
  }

  //   const { Name, password, ...userData } = payload;

  const result = await User.findOneAndUpdate({ Id: id }, payload, {
    new: true,
  });
  return result;
};
// delete
export const deleteUserService = async (id: string): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({
    Id: id,
  });
  return result;
};
