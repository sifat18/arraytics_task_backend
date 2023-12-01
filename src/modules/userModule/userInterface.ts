import { Model } from "mongoose";

export type IUser = {
  Id: string;
  Name: string;
  role: "admin" | "client";
  password: string;
  email: string;
  created_by: string;
};
export type UserModel = {
  isUserExist(email: string): Promise<IUser>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
  searchTerm?: string;
  email?: string;
  Name?: string;
  Id?: string;
  created_by?: string;
};
