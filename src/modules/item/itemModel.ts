import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
import { IItem } from "./itemInterface";
export const itemSchema = new Schema<IItem>(
  {
    Id: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
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
itemSchema.statics.isItemExist = async function (
  Id: string
): Promise<IItem | null> {
  return await Item.findOne({ Id });
};

export const Item = model<IItem>("Item", itemSchema);
