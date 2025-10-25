import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';
import { modelNames, paymentStatus } from '../constants/constants.js';
import Booking from './booking.models.js';

const Payment = sequelize.define(
  modelNames.payment,
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    booking_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Booking,
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [
        paymentStatus.completed,
        paymentStatus.pending,
        paymentStatus.refunded,
      ],
      defaultValue: paymentStatus.pending,
    },
  },
  {
    tableName: 'payments',
  },
);

export default Payment;
