import { Secret } from "jsonwebtoken";
import config from "../../config";
import APIError from "../../errorHelpers/APIError";
import { User } from "../userModule/userModel";
import { IUser } from "../userModule/userInterface";
import mongoose from "mongoose";

// creating user
export const createUserService = async (user: any): Promise<IUser | null> => {
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate user  id
    const id = await generateLastID();

    (user as IUser).Id = id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new APIError(400, "Failed to create student");
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({ Id: newUserAllData.Id });
  }

  return newUserAllData;
};
export const generateLastID = async (): Promise<string> => {
  const lastId = await User.find({}, { Id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();
  const currentId = (await lastId[0]?.Id) || (0).toString().padStart(5, "0"); //00000
  //increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, "0");
  //20 25
  incrementedId = `${incrementedId}`;

  return incrementedId;
};
