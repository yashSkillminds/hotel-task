import express from 'express';
import * as userController from '../controllers/user.controllers.js';
import * as hotelController from '../controllers/hotel.controllers.js';
import * as bookingController from '../controllers/booking.controllers.js';
import * as roomController from '../controllers/room.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createBookingValidation,
  getHotelsValidations,
  userUpdateValidations,
  uuidValidations,
} from '../utils/validations.js';

const router = express.Router();

// user details
router.route('/user/me').get(authMiddleware, userController.getUserDetails);
router
  .route('/user/update')
  .put(
    authMiddleware,
    userUpdateValidations,
    validateRequest,
    userController.updateDetails,
  );

// hotel
router
  .route('/hotels')
  .get(
    authMiddleware,
    getHotelsValidations,
    validateRequest,
    hotelController.getAllHotels,
  );
router
  .route('/hotels/:id')
  .get(
    authMiddleware,
    uuidValidations,
    validateRequest,
    hotelController.getHotelDetails,
  );

// room
// router.route('/hotels/:id/rooms').get();
// router.route('/rooms/:id').get();
router
  .route('/hotels/:id/rooms')
  .get(uuidValidations, validateRequest, roomController.getAllRoomDetails);
router
  .route('/rooms/:id')
  .get(uuidValidations, validateRequest, roomController.getARoomDetails);

// bookings
router
  .route('/bookings')
  .post(
    authMiddleware,
    createBookingValidation,
    validateRequest,
    bookingController.createBooking,
  );
router
  .route('/bookings/:id/cancel')
  .patch(
    authMiddleware,
    uuidValidations,
    validateRequest,
    bookingController.cancelBooking,
  );

export default router;
