import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config';
import { bookingStatus, modelNames } from '../constants/constants';
import Room from './room.models';
import User from './user.models';

const Booking = sequelize.define(
  modelNames.booking,
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    check_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check_out: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [bookingStatus.booked, bookingStatus.cancelled],
      defaultValue: bookingStatus.booked,
    },
  },
  {
    tableName: 'bookings',
  },
);

export default Booking;
