import { body, param, query } from 'express-validator';

export const nameValidator = body('name')
  .isString()
  .withMessage('Name must be a string')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters');

export const emailValidator = body('email')
  .isString()
  .withMessage('Email must be a string')
  .trim()
  .isEmail()
  .withMessage('Invalid email address');

export const passwordValidator = body('password')
  .isString()
  .withMessage('Password must be a string')
  .trim()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .isStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  .withMessage(
    'Password must contain uppercase, lowercase, number, and symbol',
  );

export const locationValidator = body('location')
  .isString()
  .withMessage('Location must be a string')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Location must be between 2 and 100 characters');

export const pageValidator = query('page')
  .optional()
  .isInt({ min: 1 })
  .withMessage('Page must be a positive integer');

export const limitValidator = query('limit')
  .optional()
  .isInt({ min: 1, max: 100 })
  .withMessage('Limit must be between 1 and 100');

export const sortByPaginationValidation = query('sortBy')
  .optional()
  .isIn(['name', 'location'])
  .withMessage('Invalid sort field');

export const orderPaginationValidation = query('order')
  .optional()
  .isIn(['ASC', 'DESC', 'asc', 'desc'])
  .withMessage('Order must be either ASC or DESC');

export const uuidValidation = param('id')
  .isUUID()
  .withMessage('Invalid UUID format for ID');

export const roomIdValidation = body('room_id').exists().withMessage('Room ID is required').isUUID().withMessage('Invalid UUID format for Room ID');

export const checkInValidation = body('check_in').exists().withMessage('Check-in date is required').isISO8601().withMessage('Invalid date format for Check-in date');

export const checkOutValidation = body('check_out').exists().withMessage('Check-out date is required').isISO8601().withMessage('Invalid date format for Check-out date');

export const roomNumberValidation = body('room_number').exists().withMessage('Room number is required').isString().withMessage('Invalid room number');

export const roomTypeValidation = body('type').exists().withMessage('Room type is required').isIn(['single', 'double', 'suite']).withMessage('Invalid room type');

export const roomPriceValidation = body('price').exists().withMessage('Room price is required').isNumeric().withMessage('Invalid room price');

export const roomAvailabilityValidation = body('is_available').exists().withMessage('Room availability is required').isBoolean().withMessage('Invalid room availability');
