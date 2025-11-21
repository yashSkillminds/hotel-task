import {
  nameValidator,
  emailValidator,
  passwordValidator,
  locationValidator,
  pageValidator,
  limitValidator,
  sortByPaginationValidation,
  orderPaginationValidation,
  uuidValidation,
  roomIdValidation,
  checkInValidation,
  checkOutValidation,
  roomAvailabilityValidation,
  roomPriceValidation,
  roomTypeValidation,
  roomNumberValidation,
} from './validationRules.js';
import { body } from 'express-validator';

export const userRegistrationValidation = [
  nameValidator,
  emailValidator,
  passwordValidator,
];

export const userLoginValidation = [
  emailValidator,
  //validate only length of password here in login
  body('password')
    .isString()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const userUpdateValidations = [
  nameValidator.optional(),
  passwordValidator.optional(),
  // emailValidator.optional()
];

export const hotelCreateValidations = [nameValidator, locationValidator];

export const getHotelsValidations = [
  pageValidator,
  limitValidator,
  sortByPaginationValidation,
  orderPaginationValidation,
];

export const uuidValidations = [uuidValidation];

export const roomCreateValidations = [
  roomNumberValidation,
  roomTypeValidation,
  roomPriceValidation,
  uuidValidation,
  roomAvailabilityValidation.optional(),
];

export const roomUpdateValidations = [
  roomTypeValidation.optional(),
  roomPriceValidation.optional(),
];

export const hotelUpdateValidations = [
  uuidValidation,
  nameValidator.optional(),
  locationValidator.optional(),
];

export const createBookingValidation = [
  roomIdValidation,
  checkInValidation,
  checkOutValidation,
];

export const getUsersValidations = [pageValidator, limitValidator];
