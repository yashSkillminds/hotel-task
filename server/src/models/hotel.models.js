import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';
import { modelNames } from '../constants/constants.js';
import User from './user.models.js';

const Hotel = sequelize.define(
  modelNames.hotel,
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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'hotels',
  },
);

export default Hotel;
