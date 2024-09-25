const User = require('../model/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const client = require('../database/redis');
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

const register = async (req, res) => {
  const { codinome, afiliacao, senha } = req.body;

  try {
    let usuarioExistente = await User.findOne({ codinome });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Codinome já cadastrado' });
    }

    const novoUsuario = new User({ codinome, afiliacao, senha });
    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  const { codinome, senha } = req.body;

  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ errors: erros.array() });
  }

  try {
    const usuario = await User.findOne({ codinome });

    if (!usuario || !(await usuario.comparePassword(senha))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: usuario._id, codinome: usuario.codinome }, JWT_SECRET, { expiresIn: '1h' });

    await client.set(`sessao:${usuario._id}`, token, { EX: 3600 });

    res.json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

const logout = async (req, res) => {
  const { userId } = req.user;

  try {
    await client.del(`sessao:${userId}`);
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar logout' });
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    const session = await client.get(`sessao:${decoded.userId}`);
    if (!session) {
      return res.status(401).json({ error: 'Sessão expirada' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = { register, login, logout, authMiddleware };
