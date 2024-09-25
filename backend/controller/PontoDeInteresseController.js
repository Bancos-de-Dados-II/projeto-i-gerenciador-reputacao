const client = require('../database/redis');
const PontoDeInteresse = require('../model/PontoDeInteresse');
const { v4: uuidv4, parse: uuidParse, stringify: uuidStringify } = require('uuid');

const listarPontosDeInteresse = async (req, res) => {
  const { query, lat, lng, maxDistance = 5000 } = req.query;

  try {
    if (!query && !lat && !lng) {
      const cache = await client.keys('pontosDeInteresse*');

      if (cache.length > 0) {
        const pontosEmCache = await Promise.all(
          cache.map(async (key) => {
            const cachedData = await client.get(key);
            return JSON.parse(cachedData);
          })
        );

        console.log('Informação recuperada de cache');
        return res.json(pontosEmCache); 
      }

      console.log('Informação não encontrada em cache. Buscando todos os pontos no banco de dados');
      const pontosDeInteresse = await PontoDeInteresse.find();

      await Promise.all(
        pontosDeInteresse.map(async (ponto) => {
          await client.set(`pontosDeInteresse:${ponto._id}`, JSON.stringify(ponto), {
            EX: 3600
          });
        })
      );

      return res.json(pontosDeInteresse);
    }
    
    const buscaCustomizadaQuery = {};

    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({ error: "Parâmetros de localização inválidos" });
    }
    
    if (lat && lng) {
      buscaCustomizadaQuery.pontoDeInteresse = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    let pontosDeInteresse = await PontoDeInteresse.find(buscaCustomizadaQuery);

    if (query) {
      pontosDeInteresse = pontosDeInteresse.filter(ponto => 
        ponto.titulo.toLowerCase().includes(query.toLowerCase())
      );
    }

    await Promise.all(
      pontosDeInteresse.map(async (ponto) => {
        await client.set(`pontosDeInteresse:${ponto._id}`, JSON.stringify(ponto), {
          EX: 3600
        });
      })
    );

    res.json(pontosDeInteresse);
    
  } catch (error) {
    console.error('Erro ao listar pontos de interesse:', error);
    res.status(400).json({ error: 'Erro na requisição', details: error.message });
  }
};

const criarPontoDeInteresse = async (req, res) => {

  try {

    const novoPontoDeInteresse = await PontoDeInteresse.create(req.body);
    
    await client.set(`pontosDeInteresse:${novoPontoDeInteresse._id}`, JSON.stringify(novoPontoDeInteresse), {
      EX: 3600
    });

    res.status(201).send(novoPontoDeInteresse);
  } catch (error) {
    res.status(400).send(error);
  }
};

const atualizarPontoDeInteresse = async (req, res) => {

  const { id } = req.params;
  const pontoDeInteresseAlterado = req.body;

  try {

    const pontoDeInteresse = await PontoDeInteresse.findByIdAndUpdate(id, pontoDeInteresseAlterado, {new:true});

    if (!pontoDeInteresse) {
      return res.status(404).send('Ponto de interesse não encontrado');
    }
    
    await client.set(`pontosDeInteresse:${pontoDeInteresse._id}`, JSON.stringify(pontoDeInteresse), {
      EX: 3600
    });

    res.json(pontoDeInteresse);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deletarPontoDeInteresse = async (req, res) => {

  const { id } = req.params;

  try {

    const pontoDeInteresse = await PontoDeInteresse.findByIdAndDelete(id);

    if (!pontoDeInteresse) {
      return res.status(404).send('Ponto de interesse não encontrado');
    }

    const pontosDeInteresse = await PontoDeInteresse.find();
    await client.del(`pontosDeInteresse:${pontoDeInteresse._id}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { listarPontosDeInteresse, criarPontoDeInteresse, atualizarPontoDeInteresse, deletarPontoDeInteresse};