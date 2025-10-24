import { Sequelize } from 'sequelize';
import 'dotenv/config';

// const sequelize = new Sequelize("mysql:memory");
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB,
    // dialect: "mysql",
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful!');
  } catch (error) {
    console.error(`DB connection failed! ERROR: ${error}`);
    process.exit(1);
  }
};
