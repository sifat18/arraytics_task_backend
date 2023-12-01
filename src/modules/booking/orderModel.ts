import { Schema, model } from "mongoose";
import { IOrder, OrderModel } from "./orderInterface";
import { Item } from "../item/itemModel";
import { User } from "../userModule/userModel";

export const orderSchema = new Schema<IOrder, OrderModel>(
  {
    services: { type: Schema.Types.ObjectId, ref: Item, required: true },
    client: { type: Schema.Types.ObjectId, ref: User, required: true },
    status: {
      type: String,
      enum: ["pending", "approved"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Order = model<IOrder, OrderModel>("Order", orderSchema);
