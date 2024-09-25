const express = require('express');
const pontoDeInteresseRouter = express.Router();
const app = express();
const { body } = require('express-validator');
const { register, login, logout, authMiddleware } = require('../controller/AuthController');

const {listarPontosDeInteresse, criarPontoDeInteresse, atualizarPontoDeInteresse, deletarPontoDeInteresse} = 
    require('../controller/PontoDeInteresseController');

app.use(express.json());

pontoDeInteresseRouter.post(
    '/register',
    [
      body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
    ],
    register
  );
  
  pontoDeInteresseRouter.post(
    '/login',
    [
      body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
    ],
    login
  );
  
  pontoDeInteresseRouter.post('/logout', authMiddleware, logout);

pontoDeInteresseRouter.get('/', authMiddleware, listarPontosDeInteresse);
pontoDeInteresseRouter.post('/', authMiddleware, criarPontoDeInteresse);
pontoDeInteresseRouter.put('/:id', authMiddleware, atualizarPontoDeInteresse);
pontoDeInteresseRouter.delete('/:id', authMiddleware, deletarPontoDeInteresse);

module.exports = pontoDeInteresseRouter;