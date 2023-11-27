import { Secret } from "jsonwebtoken";
import config from "../../config";
import APIError from "../../errorHelpers/APIError";
import { User } from "../userModule/userModel";
import { IUser } from "../userModule/userInterface";
import mongoose from "mongoose";
import { ILoginUser, ILoginUserResponse } from "../../config/interfaces/login";
import { createToken } from "../../shared/jwtHelper";

// creating user
export const createUserService = async (
  user: Omit<IUser, "Id">
): Promise<IUser | null> => {
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

// login
export const loginUserService = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new APIError(404, "User does not exist");
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new APIError(401, "Password is incorrect");
  }

  //create access token & refresh token

  const { Id, role, service }: any = isUserExist;
  const accessToken = createToken(
    { Id, role, email, service },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = createToken(
    { Id, role, email, service },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
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
