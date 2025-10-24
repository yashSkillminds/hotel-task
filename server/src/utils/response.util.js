import { ApiError } from './ApiError.js';
import { ApiResponse } from './ApiResponse.js';

export const errorResponse = (res, statusCode, message, errors = []) => {
  throw new ApiError(statusCode, message, errors);
};

export const successResponse = (res, statusCode, data = {}, message) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
};
