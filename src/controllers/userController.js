import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';

const config = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE, 
  password: process.env.DATABASE_PASSWORD, 
  port: process.env.DATABASE_PORT, 
  max: process.env.DATABASE_MAX_CONNECTIONS,
  idleTimeoutMillis: process.env.DATABASE_TIME,
};

var pool = new pg.Pool(config);

export const loginRequired = (req, res, next) => {
}

export const register = (req, res) => {
}

export const login = (req,res) => {
}