import { Request, RequestHandler, Response } from "express";

import catchAsync from "../../shared/catchAsync";
import APIError from "../../errorHelpers/APIError";
import { pick, userFilterableFields } from "../../shared/pick";
import reponseFormat from "../../shared/responseFormat";
import { IItem } from "./itemInterface";
import {
  createItemService,
  deleteItemService,
  getAllItemService,
  updateItemService,
} from "./itemService";

// create item

// signup
export const createItem: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...itemData } = req.body;
    const result = await createItemService(itemData);

    reponseFormat<IItem>(res, {
      success: true,
      statusCode: 200,
      message: "Item created successfully !",
      data: result,
    });
  }
);
// all item
export const getAllItems: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);

    const result = await getAllItemService(filters);

    reponseFormat<IItem[]>(res, {
      statusCode: 200,
      success: true,
      message: "Items retrieved successfully",
      data: result,
    });
  }
);
// update
export const updateItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await updateItemService(id, updatedData);

  reponseFormat<IItem>(res, {
    statusCode: 200,
    success: true,
    message: "Item updated successfully",
    data: result,
  });
});
// delete
export const deleteItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteItemService(id);

  reponseFormat<IItem>(res, {
    statusCode: 200,
    success: true,
    message: "Item deleted successfully",
    data: result,
  });
});
