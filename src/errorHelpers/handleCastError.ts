import mongoose from "mongoose";
import { IGenericErrorMessage } from "./error";

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: "Invalid Id",
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Cast Error",
    errorMessages: errors,
    stack: error.stack,
  };
};

export default handleCastError;
