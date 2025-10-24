import { userRoles } from '../constants/constants.js';
import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { userRegistrationValidation } from '../utils/validations.js';
import crypto from 'crypto';

export const createAdmin = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== 'admin') throw new ApiError(400, 'Unauthorized access');

  userRegistrationValidation(req);

  const { name, email, password } = req.body;

  const id = crypto.randomUUID();

  const admin = await User.create({
    id,
    name,
    email,
    password,
    role: userRoles.admin,
  });

  if (!admin) throw new ApiError(400, 'Admin registration failed');

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: admin,
      },
      'Admin created successfully!',
    ),
  );
});

export const updateUserToAdmin = asyncHandler(async (req, res) => {
  const userId = req.params?.id;

  try {
    const user = await User.findByPk(userId);
  
    if (!user) throw new ApiError(404, "User not found");
  
    user.role = userRoles.admin;
  
    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "User role updated successfully!"))
  } catch (error) {
    console.log(error?.message);
    throw new ApiError(500, "Something went wrong while updating user to admin");
  }
  
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const adminId = req.params?.id;

  const user = await User.findByPk(adminId);
  if (!user) throw new ApiError(404, 'Admin not found');

  if (user.role !== 'admin') {
    throw new ApiError(403, 'Only admins can be deleted via this route');
  }

  // Soft delete
  // will add a deleted at timestamp in the db for the record
  await user.destroy();

  //   Hard delete
  // Permanently deletes the record
  //   await user.destroy({ force: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Admin deleted successfully!'));
});
