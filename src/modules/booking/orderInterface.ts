import { Model, Types } from "mongoose";
import { IItem } from "../item/itemInterface";
import { IUser } from "../userModule/userInterface";

export interface IOrder {
  services: Types.ObjectId | IItem;
  client: Types.ObjectId | IUser;
  status: "approved" | "pending";
}
export type OrderModel = Model<IOrder, Record<string, unknown>>;
