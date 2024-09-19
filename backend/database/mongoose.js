const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

async function conectar() { 
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Conectado ao MongoDB Atlas');
    }).catch((error) => {
        console.error('Erro ao conectar ao MongoDB Atlas', error);
    })
};

conectar();

module.exports = mongoose;
