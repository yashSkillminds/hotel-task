import 'dotenv/config';
import { connectDB } from './config/db.config.js';
import { app } from './app.js';
import { setAssociations } from './models/associations.js';

connectDB()
  .then(() => {
    setAssociations();
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('Database connection failed!');
  });
