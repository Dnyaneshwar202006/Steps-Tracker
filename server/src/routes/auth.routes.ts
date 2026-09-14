import express from 'express'
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middlewares';
import { loginValidator, registerValidator } from '../validators/auth.validator';

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

export default router;