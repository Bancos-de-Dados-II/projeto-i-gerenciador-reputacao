const client = require('../database/redis');
const PontoDeInteresse = require('../model/PontoDeInteresse');

const listarPontosDeInteresse = async (req, res) => {

  const cache = await client.get('pontoDeInteresse');

  try {
    if(cache){
      console.log('Informação recuperada de cache');
      res.json(JSON.parse(cache));
    }else{
      console.log('Informação não encontrada em cache');
      const pontosDeInteresse = await PontoDeInteresse.find();
  
      await client.set('pontosDeInteresse', JSON.stringify(pontosDeInteresse),{
        EX: 3600
      });
  
      res.json(pontosDeInteresse);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const criarPontoDeInteresse = async (req, res) => {

  try {

    const novoPontoDeInteresse = await PontoDeInteresse.create(req.body);
    
    await client.set(`pontoDeInteresse:${novoPontoDeInteresse._id}`, JSON.stringify(novoPontoDeInteresse), {
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
    
    await client.set(`pontoDeInteresse:${pontoDeInteresse._id}`, JSON.stringify(pontoDeInteresse), {
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
    await client.del(`pontoDeInteresse:${pontoDeInteresse._id}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
};


module.exports = { listarPontosDeInteresse, criarPontoDeInteresse, atualizarPontoDeInteresse, deletarPontoDeInteresse};