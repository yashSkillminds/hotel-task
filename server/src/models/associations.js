import User from './user.models.js';
import Hotel from './hotel.models.js';
import Room from './room.models.js';
import Booking from './booking.models.js';
import Payment from './payment.models.js';

export const setAssociations = () => {
  User.hasMany(Hotel, { foreignKey: 'createdBy', as: 'hotels' });
  Hotel.belongsTo(User, { foreignKey: 'createdBy', as: 'owner' });

  Hotel.hasMany(Room, { foreignKey: 'hotel_id', as: 'rooms' });
  Room.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

  Room.hasMany(Booking, { foreignKey: 'room_id', as: 'bookings' });
  Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

  User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
  Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Booking.hasOne(Payment, { foreignKey: 'booking_id', as: 'payment' });
  Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
};