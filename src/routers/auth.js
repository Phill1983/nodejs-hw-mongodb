import express from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/validationSchemas.js';
import resetEmailSchema from "../schemas/resetEmailSchema.js";
import resetPasswordSchema from "../schemas/resetPasswordSchema.js";


const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmailController);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);



export default router;
