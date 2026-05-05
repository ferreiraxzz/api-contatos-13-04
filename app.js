const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const middlewareError = require('./errors/errors');

dotenv.config();

const app = express();
app.use(express.json());

const contatoRouter = require('./routes/contatoRoutes');
app.use('/contatos', contatoRouter);
app.use(middlewareError); // Adiciona o middleware de erro para rotas não encontradas

mongoose.set('strictQuery', false); // Para suprimir o warning de depreciação
mongoose.connect(process.env.MONGODB_URI)
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