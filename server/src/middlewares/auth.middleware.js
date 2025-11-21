import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Access token missing');
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired access token');
  }

  let user;

  try {
    user = await User.findByPk(decodedToken.id);
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while fetching user details.',
    );
  }

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const { password, refreshToken, ...safeUser } = user.toJSON();

  req.user = safeUser;

  next();
});
