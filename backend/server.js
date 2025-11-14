const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8081;

const cliente = require('./controllers/ClientController.js');
const funcionario = require('./controllers/FuncionarioController.js');
const venda = require('./controllers/VendasController.js');
const produto = require('./controllers/ProductController.js');

app.use(bodyParser.json());

app.use(cors())
app.get('/', (req, res) => res.send('Index'))
app.use('/cliente', cliente)
app.use('/funcionario', funcionario)
app.use('/produto', produto)
app.use('/venda', venda)

app.listen(port, () => console.log("Servidor do back rodando!"))
