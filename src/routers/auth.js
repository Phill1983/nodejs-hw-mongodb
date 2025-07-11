import express from 'express';
import * as authController from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/validationSchemas.js';
import resetEmailSchema from "../schemas/resetEmailSchema.js";

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

router.post('/send-reset-email', validateBody(resetEmailSchema), authController.sendResetEmail);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
