import {Router} from 'express';
import { login, register } from '../controllers/login.controllers.js';

const loginRouter = Router();

loginRouter.post('/login', login);
loginRouter.post('/register', register);

export default loginRouter;