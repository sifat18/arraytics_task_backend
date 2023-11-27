import mongoose, { SortOrder } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
import { itemSearchableFields, userSearchableFields } from "../../shared/pick";
import APIError from "../../errorHelpers/APIError";
import { IItem, IItemFilters } from "./itemInterface";
import { Item } from "./itemModel";

// creating user
export const createItemService = async (
  item: Omit<IItem, "Id">
): Promise<IItem | null> => {
  let newItemAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // generate   id
    const id = await generateLastID();

    (item as IItem).Id = id;

    const newItem = await Item.create([item], { session });

    if (!newItem.length) {
      throw new APIError(400, "Failed to create item");
    }

    newItemAllData = newItem[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  if (newItemAllData) {
    newItemAllData = await Item.findOne({ Id: newItemAllData.Id });
  }

  return newItemAllData;
};

// getting all
export const getAllItemService = async (
  filters: IItemFilters
): Promise<IItem[]> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  // search
  if (searchTerm) {
    andConditions.push({
      $or: itemSearchableFields.map((field) => ({
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

  const result = await Item.find(whereConditions).sort(sortConditions);

  return result;
};

// update
export const updateItemService = async (
  id: string,
  payload: Partial<IItem>
): Promise<IItem | null> => {
  const isExist = await Item.findOne({ Id: id });

  if (!isExist) {
    throw new APIError(404, "Items not found !");
  }

  const result = await Item.findOneAndUpdate({ Id: id }, payload, {
    new: true,
  });
  return result;
};
// delete
export const deleteItemService = async (id: string): Promise<IItem | null> => {
  const result = await Item.findOneAndDelete({
    Id: id,
  });
  return result;
};

export const generateLastID = async (): Promise<string> => {
  const lastId = await Item.find({}, { Id: 1, _id: 0 })
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
