import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';
import { modelNames, roomTypes } from '../constants/constants.js';
import Hotel from './hotel.models.js';

const Room = sequelize.define(
  modelNames.room,
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    hotel_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Hotel,
        key: 'id',
      },
    },
    room_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: [roomTypes.single, roomTypes.double, roomTypes.suite],
      defaultValue: roomTypes.suite,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'rooms',
  },
);

export default Room;
