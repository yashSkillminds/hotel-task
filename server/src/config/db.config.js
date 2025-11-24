import { Sequelize } from 'sequelize';
import 'dotenv/config';
import fs from 'fs';

const isProduction = process.env.NODE_ENV === 'production';

// const sequelize = new Sequelize("mysql:memory");
export const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'mysql',
  ...(isProduction && {
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(process.env.AIVEN_MYSQL_CA_PATH || './ca.pem'),
        rejectUnauthorized: true,
        require: true,
      },
    },
  }),
});

// export const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     // dialect: process.env.DB,
//     dialect: 'mysql',
//   },
// );

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful!');
  } catch (error) {
    console.error(`DB connection failed! ERROR: ${error}`);
    process.exit(1);
  }
};
