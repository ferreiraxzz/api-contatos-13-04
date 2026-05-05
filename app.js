const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const middlewareError = require('./errors/errors');

dotenv.config();

const app = express();
app.use(express.json());

// Rota raiz - Informações sobre a API
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API de Contatos funcionando corretamente',
    version: '1.0.0',
    endpoints: {
      contatos: {
        listar: 'GET /contatos',
        criar: 'POST /contatos',
        buscar: 'GET /contatos/:id',
        atualizar: 'PUT /contatos/:id',
        deletar: 'DELETE /contatos/:id'
      }
    }
  });
});

const contatoRouter = require('./routes/contatoRoutes');
app.use('/contatos', contatoRouter);
app.use(middlewareError); // Adiciona o middleware de erro para rotas não encontradas

mongoose.set('strictQuery', false); // Para suprimir o warning de depreciação

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Erro: MONGODB_URI não está definido. Defina esta variável de ambiente no Render.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado ao MongoDB!');
  })
  .catch((err) => {
    console.error('Erro de conexão ao MongoDB:', err.message);
    process.exit(1); // Encerra o app se não conseguir conectar
  });

const PORT = process.env.PORT || 3000;

// Só inicia o servidor se este arquivo for executado diretamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;