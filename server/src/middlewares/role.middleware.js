import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const roleMiddleware = asyncHandler(async (req, _, next) => {
  const { role } = req.user;

  if (!role) {
    throw new ApiError(400, 'Bad request: User role not found');
  }

  if (role !== 'admin') {
    throw new ApiError(401, 'Unauthorized access');
  }

  next();
});
