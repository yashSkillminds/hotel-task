import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) throw new ApiError(401, 'User details not found');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User data retrieved successfully!'));
});

export const updateDetails = asyncHandler(async (req, res) => {
  const {
    name,
    password,
    // , email
  } = req.body;
  const userId = req.user?.id;

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const hasNameChanged = name?.trim() && name.trim() !== user.name;
  const hasPasswordChanged = password?.trim();

  if (!hasNameChanged && !hasPasswordChanged) {
    throw new ApiError(400, 'No changes detected in update request');
  }

  if (hasNameChanged) user.name = name.trim();
  if (hasPasswordChanged) user.password = password.trim();

  await user.save();

  const { password: p, refreshToken: r, ...safeUser } = user.toJSON();

  return res
    .status(200)
    .json(new ApiResponse(200, { user: safeUser }, 'User updated successfully!'));
});
