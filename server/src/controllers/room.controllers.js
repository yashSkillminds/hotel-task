import Hotel from '../models/hotel.models.js';
import Room from '../models/room.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';

/**
 * @desc    Get all room details under a specific hotel
 * @route   GET /api/hotels/:id/rooms
 * @access  Private (Admin)
 */
export const getAllRoomDetails = asyncHandler(async (req, res) => {
  const hotelId = req.params?.id;

  try {
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) throw new ApiError(404, 'Hotel not found');

    const rooms = await Room.findAll({
      where: { hotel_id: hotelId },
      order: [['room_number', 'ASC']],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, rooms, 'Rooms fetched successfully'));
  } catch (error) {
    console.error('Get all Room Details Error:', error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while fetching room details',
    );
  }
});

/**
 * @desc    Get details of a specific room
 * @route   GET /api/rooms/:id
 * @access  Private (Admin)
 */
export const getARoomDetails = asyncHandler(async (req, res) => {
  const roomId = req.params?.id;

  try {
    const room = await Room.findByPk(roomId);
    if (!room) throw new ApiError(404, 'Room not found');

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          room,
          'All Room details of the given Hotel fetched successfully',
        ),
      );
  } catch (error) {
    console.error('Get a Room Details Error:', error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while fetching room details',
    );
  }
});

/**
 * @desc    Create a new room under a hotel
 * @route   POST /api/hotels/:id/rooms
 * @access  Private (Admin)
 */
export const createRoom = asyncHandler(async (req, res) => {
  const hotelId = req.params?.id;
  const { room_number, type, price } = req.body;

  try {
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) throw new ApiError(404, 'Hotel not found');

    const id = crypto.randomUUID();

    const isRoomAlreadyPresent = await Room.findOne({
      where: {
        hotel_id: hotelId,
        room_number,
      },
    });

    if (isRoomAlreadyPresent) throw new ApiError(409, 'Room already exists');

    const room = await Room.create({
      id,
      hotel_id: hotelId,
      room_number,
      type: type?.trim(),
      price: Number(price),
      is_available: true,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, room, 'Room created successfully'));
  } catch (error) {
    console.error('Create Room Error:', error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while creating the room',
    );
  }
});

/**
 * @desc    Update room details (type, price)
 * @route   PUT /api/rooms/:id
 * @access  Private (Admin)
 */
export const updateRoom = asyncHandler(async (req, res) => {
  const roomId = req.params?.id;
  const { type, price } = req.body;

  try {
    const room = await Room.findByPk(roomId);
    if (!room) throw new ApiError(404, 'Room not found');

    // Normalize and validate inputs
    const normalizedType = typeof type === 'string' ? type.trim() : undefined;
    const normalizedPrice =
      price !== undefined && price !== null && !isNaN(Number(price))
        ? Number(price)
        : undefined;

    const hasTypeChanged = normalizedType && normalizedType !== room.type;
    const hasPriceChanged =
      typeof normalizedPrice === 'number' &&
      normalizedPrice !== Number(room.price);

    if (!hasTypeChanged && !hasPriceChanged) {
      throw new ApiError(400, 'No changes detected in update request');
    }

    if (hasTypeChanged) room.type = normalizedType;
    if (hasPriceChanged) room.price = normalizedPrice;

    await room.save();

    return res
      .status(200)
      .json(new ApiResponse(200, room, 'Room updated successfully!'));
  } catch (error) {
    console.error('Update Room Error:', error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while updating the room',
    );
  }
});

/**
 * @desc    Delete (soft delete) a room
 * @route   DELETE /api/rooms/:id
 * @access  Private (Admin)
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const roomId = req.params?.id;

  try {
    const room = await Room.findByPk(roomId);
    if (!room) throw new ApiError(404, 'Room not found');

    // Soft delete (marks record deletedAt if paranoid mode is enabled)
    await room.destroy();

    // Hard delete (use only if you want to remove permanently)
    // await room.destroy({ force: true });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Room deleted successfully!'));
  } catch (error) {
    console.error('Delete Room Error:', error?.message);
    throw new ApiError(
      error?.statusCode ?? 500,
      error?.message ?? 'Something went wrong while deleting the room',
    );
  }
});
