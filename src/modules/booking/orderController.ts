import { NextFunction, Request, RequestHandler, Response } from "express";
import { IOrder } from "./orderInterface";
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  updateOrderService,
} from "./orderService";
import mongoose from "mongoose";
import { Order } from "./orderModel";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import APIError from "../../errorHelpers/APIError";

export const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createOrderService(req.body);
    reponseFormat<IOrder>(res, {
      statusCode: 200,
      success: true,
      message: "Order created successfully",
      data: result,
    });
  }
);
// get all
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllOrderService(req.user);

  reponseFormat<IOrder[]>(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully !",
    data: result,
  });
});

// delete
export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteOrderService(id);

  reponseFormat<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});
// update
export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await updateOrderService(id, updatedData, req.user);

  reponseFormat<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});
