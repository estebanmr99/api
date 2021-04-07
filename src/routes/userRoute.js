import { Router } from 'express';
import { login, register, loginRequired } from '../Controllers/userControllers.js';
import pg from 'pg';

const config = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE, 
  password: process.env.DATABASE_PASSWORD, 
  port: process.env.DATABASE_PORT, 
  max: process.env.DATABASE_MAX_CONNECTIONS,
  idleTimeoutMillis: process.env.DATABASE_TIME,
};

const router = Router();
var pool = new pg.Pool(config);

// registration route
router.post('/auth/register', register);

// login route
router.post('/login', login);

export default router;