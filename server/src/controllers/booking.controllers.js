import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Booking from "../models/booking.models.js";
import Payment from '../models/payment.models.js';
import Room from '../models/room.models.js';
import { bookingStatus, paymentStatus } from '../constants/constants.js';
import crypto from 'crypto';
import { sequelize } from '../config/db.config.js';

export const createBooking = asyncHandler(async (req, res) => {
  const id = crypto.randomUUID();
  const paymentId = crypto.randomUUID();
  const { room_id, check_in, check_out, status: paymentStat } = req.body;
  const user_id = req.user?.id;

  const transaction = await sequelize.transaction();

  try {
    const room = await Room.findByPk(room_id, { transaction });
    if (!room) throw new ApiError(404, 'Room not found');

    const existingBookings = await Booking.findAll({
      where: { room_id, status: bookingStatus.booked },
      transaction,
      lock: transaction.LOCK.UPDATE // prevents race conditions
    });

    const hasOverlap = existingBookings.some(booking => {
      const existingCheckIn = new Date(booking.check_in);
      const existingCheckOut = new Date(booking.check_out);
      const newCheckIn = new Date(check_in);
      const newCheckOut = new Date(check_out);
      return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
    });

    if (hasOverlap) {
      throw new ApiError(400, "Room is already booked for the selected dates");
    }

    const booking = await Booking.create(
      { id, user_id, room_id, check_in, check_out, status: bookingStatus.booked },
      { transaction }
    );

    const paymentAmount = room.price;
    await Payment.create(
      {
        id: paymentId,
        booking_id: booking.id,
        amount: paymentAmount,
        status: paymentStat || paymentStatus.pending
      },
      { transaction }
    );

    room.is_available = false;
    await room.save({ transaction });

    await transaction.commit();

    return res
      .status(201)
      .json(new ApiResponse(201, booking, "Booking created successfully"));
  } catch (error) {
    await transaction.rollback();
    console.error("Booking creation failed:", error.message);
    throw new ApiError(500, "Something went wrong while creating the booking");
  }
});

export const cancelBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params?.id;

    try {
        const booking = await Booking.findByPk(bookingId);

        if (!booking) throw new ApiError(404, "Booking not found");

        booking.status = bookingStatus.cancelled;

        await booking.save();

        const payment = await Payment.findOne({
            where: {
                booking_id: bookingId
            }
        });

        if (payment) {
            payment.status = paymentStatus.refunded;
            await payment.save();
        }

        return res.status(200).json(new ApiResponse(200, {}, "Booking cancelled successfully!"))
    } catch (error) {
        console.log(error?.message);
        throw new ApiError(500, "Something went wrong while cancelling the booking")
    }
});
