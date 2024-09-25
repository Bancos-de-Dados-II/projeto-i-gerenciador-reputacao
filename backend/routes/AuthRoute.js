const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, authMiddleware } = require('../controller/AuthController');

const router = express.Router();

router.post(
  '/register',
  [
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
  ],
  register
);

router.post(
  '/login',
  [
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
  ],
  login
);

router.post('/logout', authMiddleware, logout);

module.exports = router;
