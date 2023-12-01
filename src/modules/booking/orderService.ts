import mongoose, { Types } from "mongoose";
import { IOrder } from "./orderInterface";
import { Order } from "./orderModel";
import { JwtPayload } from "jsonwebtoken";
import { Item } from "../item/itemModel";
import { User } from "../userModule/userModel";
import APIError from "../../errorHelpers/APIError";

export const createOrderService = async (
  data: IOrder
): Promise<IOrder | null> => {
  const serviceInfo = await Item.findOne({
    Id: data?.services,
  });
  // cow info check
  if (!serviceInfo) {
    throw new APIError(404, "Item not found");
  }

  // userInfo check
  const userInfo = await User.findOne({
    Id: data?.client,
  });
  if (!userInfo) {
    throw new APIError(404, "User not found");
  }
  if (userInfo.role !== "client") {
    throw new APIError(404, "order not possible for this user Role");
  }
  // order create
  const orderObject = {
    services: `${serviceInfo?._id}`,
    client: `${userInfo?._id}`,
    status: data?.status,
  };

  const newOrder = await Order.create(orderObject);
  if (!newOrder) {
    throw new APIError(404, "Failed to create order");
  }

  const result = await Order.findOne({
    _id: new mongoose.Types.ObjectId(newOrder?._id),
  })
    .populate({
      path: "services",
      // select: "-slots",
    })
    .populate({ path: "client", select: "-password" });
  return result;
};
// get alll
export const getAllOrderService = async (
  user: JwtPayload | null
): Promise<IOrder[] | undefined> => {
  let result;
  // let userIdAsObjecId = new mongoose.Types.ObjectId(user?.Id);
  const userInfo = await User.findOne({
    Id: user?.Id,
  });

  //  for admin
  if (user?.role === "admin") {
    result = await Order.find({})
      .populate({
        path: "services",
        select: "-slots",
      })
      .populate({ path: "client", select: "-password" });
  }
  // for buyer
  else if (user?.role === "client") {
    const exists = await Order.aggregate([
      { $match: { client: new mongoose.Types.ObjectId(userInfo?._id) } },
      {
        $lookup: {
          from: Item.collection.name,
          localField: "services",
          foreignField: "_id",
          as: "services",
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $addFields: {
          services: { $arrayElemAt: ["$services", 0] },
          client: { $arrayElemAt: ["$client", 0] },
        },
      },

      {
        $project: {
          "client.password": 0,
        },
      },
    ]);

    result = exists?.length > 0 ? exists : [];
  }

  return result;
};

export const deleteOrderService = async (
  id: string
): Promise<IOrder | null | undefined> => {
  const result = await Order.findByIdAndDelete({
    _id: new mongoose.Types.ObjectId(id),
  });

  return result;
};

export const updateOrderService = async (
  id: string,
  payload: Partial<IOrder>,
  user: JwtPayload | null
): Promise<IOrder | null> => {
  const isExist = await Order.findOne({
    _id: new mongoose.Types.ObjectId(id),
    // client: new mongoose.Types.ObjectId(user?._id),
  });

  if (!isExist) {
    throw new APIError(404, "Order not found !");
  }
  // const updatedOrderData: Partial<IOrder> = { ...payload };
  const result = await Order.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    payload,
    { new: true }
  );
  return result;
};
