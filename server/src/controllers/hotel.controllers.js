import Hotel from '../models/hotel.models.js';
import Room from '../models/room.models.js';
import Booking from '../models/booking.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getHotelPagination } from '../utils/pagination.js';
import crypto from 'crypto';

import { Op } from 'sequelize';
import { bookingStatus } from '../constants/constants.js';

export const getAllHotels = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getHotelPagination(req.query);
  const { hotelName, location, roomType } = req.query;

  try {
    const ALLOWED_SORT_FIELDS = ['name', 'location'];
    const ALLOWED_SORT_ORDERS = ['ASC', 'DESC'];

    const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'name';

    const sortOrder = ALLOWED_SORT_ORDERS.includes(
      req.query.order?.toUpperCase(),
    )
      ? req.query.order.toUpperCase()
      : 'ASC';

    const hotelWhere = {};

    if (hotelName) {
      hotelWhere.name = { [Op.like]: `%${hotelName}%` };
    }

    if (location) {
      hotelWhere.location = { [Op.like]: `%${location}%` };
    }

    const roomWhere = {};
    if (roomType) {
      roomWhere.type = { [Op.like]: `%${roomType}%` };
    }

    const { count, rows } = await Hotel.findAndCountAll({
      where: hotelWhere,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: Room,
          as: 'rooms',
          where: Object.keys(roomWhere).length ? roomWhere : undefined,
          required: !!roomType,
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          data: rows,
          meta: {
            totalItems: count,
            totalPages,
            pageSize: limit,
            currentPage: page,
          },
        },
        'Hotels data fetched successfully!',
      ),
    );
  } catch (error) {
    console.log(error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while fetching hotels data',
    );
  }
});

export const getHotelDetails = asyncHandler(async (req, res) => {
  const hotelId = req.params?.id;

  try {
    const hotel = await Hotel.findByPk(hotelId);

    if (!hotel) throw new ApiError(404, 'Hotel not found');

    const targetDate = Date.now();

    const totalBookings = await Booking.count({
      where: {
        check_out: { [Op.gte]: targetDate },
        status: bookingStatus.booked,
      },
      include: [
        {
          model: Room,
          as: 'room',
          where: { hotel_id: hotelId },
        },
      ],
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          data: { hotel },
          meta: { totalBookings },
        },
        'Hotel data fetched successfully!',
      ),
    );
  } catch (error) {
    console.log(error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while fetching hotel details',
    );
  }
});

export const createHotel = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin')
    throw new ApiError(400, 'You need to be an admin to perform this action');

  const { name, location } = req.body;

  const admin = req.user;

  const id = crypto.randomUUID();

  try {
    const isHotelAlready = await Hotel.findOne({
      where: {
        name,
        location,
      },
    });

    if (isHotelAlready) throw new ApiError(409, 'Hotel already registered!');

    const hotel = await Hotel.create({
      id,
      name,
      location,
      createdBy: admin.id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, hotel, 'Hotel registered successfully'));
  } catch (error) {
    console.log(error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Error while hotel registration',
    );
  }
});

export const updateHotelDetails = asyncHandler(async (req, res) => {
  const hotelId = req.params?.id;

  const { name, location } = req.body;

  try {
    const hotel = await Hotel.findByPk(hotelId);

    if (!hotel) throw new ApiError(404, 'Hotel not found');

    if (!name?.trim() && !location?.trim()) {
      throw new ApiError(
        400,
        'At least one field (name or location) must be provided to update.',
      );
    }

    let isChanged = false;

    if (name?.trim() && name.trim() !== hotel.name.trim()) {
      hotel.name = name.trim();
      isChanged = true;
    }

    if (location?.trim() && location.trim() !== hotel.location.trim()) {
      hotel.location = location.trim();
      isChanged = true;
    }

    if (!isChanged) {
      throw new ApiError(400, 'No changes detected — hotel data is identical.');
    }

    await hotel.save();

    return res
      .status(200)
      .json(new ApiResponse(200, hotel, 'Hotel details updated successfully!'));
  } catch (error) {
    console.error(error.message);
    throw new ApiError(
      error.statusCode ?? 500,
      error.message ?? 'Something went wrong while updating the hotel details',
    );
  }
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotelId = req.params?.id;

  try {
    const isHotel = await Hotel.findByPk(hotelId);
    if (!isHotel) throw new ApiError(404, 'Hotel not found!');

    // Soft delete
    await isHotel.destroy();

    // Hard Delete
    // await isHotel.destroy({ force: true });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Hotel deleted successfully!'));
  } catch (error) {
    console.log(error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while deleteing the hotel data',
    );
  }
});
