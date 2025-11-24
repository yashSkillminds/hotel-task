export const userRoles = Object.freeze({
  user: 'user',
  admin: 'admin',
});

export const modelNames = Object.freeze({
  user: 'User',
  booking: 'Booking',
  hotel: 'Hotel',
  payment: 'Payment',
  room: 'Room',
});

export const roomTypes = Object.freeze({
  single: 'single',
  double: 'double',
  suite: 'suite',
});

export const bookingStatus = Object.freeze({
  booked: 'booked',
  cancelled: 'cancelled',
});

export const paymentStatus = Object.freeze({
  pending: 'pending',
  completed: 'completed',
  refunded: 'refunded',
});

export const SIZE_LIMIT = '16kb';

export const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
});

export const DEFAULT_PAGINATION_DATA = {
  page: 1,
  limit: 10,
};
