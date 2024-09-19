const express = require('express');
const pontoDeInteresseRouter = express.Router();

const {listarPontosDeInteresse, criarPontoDeInteresse} = 
    require('../controller/PontoDeInteresseController');

pontoDeInteresseRouter.get('/', listarPontosDeInteresse);
pontoDeInteresseRouter.post('/', criarPontoDeInteresse);
pontoDeInteresseRouter.put('/:id', atualizarPontoDeInteresse);
pontoDeInteresseRouter.delete('/:id', deletarPontoDeInteresse);

module.exports = pontoDeInteresseRouter;