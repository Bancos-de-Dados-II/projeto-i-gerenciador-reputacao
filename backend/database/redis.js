const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

let client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

async function conectar(){
    await client.connect();
    client.on('error',err =>{
        console.log('Erro: '+err);
    });
    console.log('Conectado com o Redis');
}

conectar();

module.exports = client;