import express from 'express';
import * as hotelController from '../controllers/hotel.controllers.js';
import * as roomController from '../controllers/room.controllers.js';
import * as adminController from '../controllers/admin.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import {
  hotelCreateValidations,
  hotelUpdateValidations,
  roomUpdateValidations,
  userRegistrationValidation,
} from '../utils/validations.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { uuidValidation } from '../utils/validationRules.js';

const router = express.Router();

// hotel
router
  .route('/hotels')
  .post(
    authMiddleware,
    roleMiddleware,
    hotelCreateValidations,
    validateRequest,
    hotelController.createHotel,
  );
router
  .route('/hotels/:id')
  .put(
    authMiddleware,
    roleMiddleware,
    hotelUpdateValidations,
    validateRequest,
    hotelController.updateHotelDetails,
  );
router
  .route('/hotels/:id')
  .delete(
    authMiddleware,
    roleMiddleware,
    uuidValidation,
    validateRequest,
    hotelController.deleteHotel,
  );

// room
router
  .route('/hotels/:id/rooms')
  .post(authMiddleware, roleMiddleware, roomController.createRoom);
router
  .route('/rooms/:id')
  .put(
    authMiddleware,
    roleMiddleware,
    roomUpdateValidations,
    validateRequest,
    roomController.updateRoom,
  );
router
  .route('/rooms/:id')
  .delete(
    authMiddleware,
    roleMiddleware,
    uuidValidation,
    validateRequest,
    roomController.deleteRoom,
  );

// admin
router
  .route('/admin')
  .post(
    authMiddleware,
    roleMiddleware,
    userRegistrationValidation,
    validateRequest,
    adminController.createAdmin,
  );
router
  .route('/admin/:id')
  .patch(
    authMiddleware,
    roleMiddleware,
    uuidValidation,
    validateRequest,
    adminController.updateUserToAdmin,
  );
router
  .route('/admin/:id')
  .delete(
    authMiddleware,
    roleMiddleware,
    uuidValidation,
    validateRequest,
    adminController.deleteAdmin,
  );

export default router;
