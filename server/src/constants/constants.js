export const userRoles = {
  user: 'user',
  admin: 'admin',
};

export const modelNames = {
  user: 'User',
  booking: 'Booking',
  hotel: 'Hotel',
  payment: 'Payment',
  room: 'Room',
};

export const roomTypes = {
  single: 'single',
  double: 'double',
  suite: 'suite',
};

export const bookingStatus = {
  booked: 'booked',
  cancelled: 'cancelled',
};

export const paymentStatus = {
  pending: 'pending',
  completed: 'completed',
  refunded: 'refunded',
};

export const SIZE_LIMIT = '16kb';

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

export const DEFAULT_PAGINATION_DATA = {
  page: 1,
  limit: 10,
};
