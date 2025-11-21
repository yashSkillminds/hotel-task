import jwt from 'jsonwebtoken';
import { DataTypes } from 'sequelize';
import { modelNames, userRoles } from '../constants/constants.js';
import { errorMessages } from '../constants/message.constants.js';
import { sequelize } from '../config/db.config.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';

const User = sequelize.define(
  modelNames.user,
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3, 255],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: [userRoles.user, userRoles.admin],
      defaultValue: userRoles.user,
    },
    refreshToken: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    paranoid: true,
    timestamps: true,
  },
);

User.verifyJWT = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    if (!userId) {
      throw new ApiError(401, errorMessages.unauthorized_access);
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(400, errorMessages.user_not_found);
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? errorMessages.token_decode_failed,
    );
  }
};

User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign({ id: this.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.beforeCreate(async (user, options) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;
