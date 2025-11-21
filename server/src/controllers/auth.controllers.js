import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../constants/constants.js';
import crypto from 'crypto';

export const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validate: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while generating the tokens',
    );
  }
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const id = crypto.randomUUID();

  const isExistingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (isExistingUser)
    throw new ApiError(409, 'User with given email address already exists!');

  const user = await User.create({
    id,
    name,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(400, 'User registration failed');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User created successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Password is incorrect!');
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const { password: p, refreshToken: r, ...safeUser } = user.toJSON();

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: safeUser, accessToken, refreshToken },
        'User logged in successfully!',
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.refreshToken = '';

  await user.save({ validate: false });

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully!'));
});

export const rotateToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, 'Unauthorized');

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decodedToken) {
      throw new ApiError(401, 'Unauthorized');
    }

    const user = await User.findByPk(decodedToken.id);

    if (!user) throw new ApiError(401, 'Invalid refresh token');

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token is invalid or expired');
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          'Tokens rotated successfully',
        ),
      );
  } catch (err) {
    throw new ApiError(
      err?.statusCode ?? 500,
      err.message || 'Something went wrong while token rotation',
    );
  }
});
