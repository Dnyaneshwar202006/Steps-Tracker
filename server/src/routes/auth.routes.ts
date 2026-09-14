import express from 'express'
import { getMe, login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middlewares';
import { loginValidator, registerValidator } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middlewares';

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/me", authenticate, getMe);

export default router;