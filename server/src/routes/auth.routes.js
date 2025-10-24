import express from 'express';
import * as authController from '../controllers/auth.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  userLoginValidation,
  userRegistrationValidation,
} from '../utils/validations.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router
  .route('/register')
  .post(userRegistrationValidation, validateRequest, authController.register);
router
  .route('/login')
  .post(userLoginValidation, validateRequest, authController.login);

router.route('/logout').post(authMiddleware, authController.logout);
router.route('/rotate-token').post(authMiddleware, authController.rotateToken);

export default router;
