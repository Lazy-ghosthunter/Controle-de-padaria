const express = require('express');
const router = express.Router();


const { Cliente, Endereco, UF, Bairro, Cidade, Status } = require('../models');

// findall dos clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        return res.status(200).json(clientes);
    } catch (err) {
        console.error('Erro ao buscar os Clientes:', err);
        return res.status(500).json({ error: 'Erro ao buscar os Clientes' });
    }
});

//findall dos UF
router.get('/UF', async (req, res) => {
    try {
        const ufs = await UF.findAll();
        return res.status(200).json(ufs);
    } catch (err) {
        console.error('Erro ao buscar UFs:', err);
        return res.status(500).json({ error: 'Erro ao buscar UFs' });
    }
});

//findall status
router.get('/status', async (req, res) => {
    try {
        const status = await Status.findAll();
        return res.status(200).json(status);
    } catch (err) {
        console.error('Erro ao buscar status:', err);
        return res.status(500).json({ error: 'Erro ao buscar status' });
    }
});

//findall bairros
router.get('/bairros', async (req, res) => {
    try {
        const bairros = await Bairro.findAll();
        return res.status(200).json(bairros);
    } catch (err) {
        console.error('Erro ao buscar bairros:', err);
        return res.status(500).json({ error: 'Erro ao buscar bairros' });
    }
});


//novo bairro
router.post('/bairro', async (req, res) => {
    try {
        const { nome_bairro } = req.body;
        if (!nome_bairro) return res.status(400).json({ error: 'nome_bairro é obrigatório' });
        const [bairro, created] = await Bairro.findOrCreate({ where: { nome_bairro } });
        return res.status(created ? 201 : 200).json(bairro);
    } catch (err) {
        console.error('Erro ao criar bairro:', err);
        return res.status(500).json({ error: 'Erro ao criar bairro' });
    }
});

//find all cidades
router.get('/cidades', async (req, res) => {
    try {
        const cidades = await Cidade.findAll();
        return res.status(200).json(cidades);
    } catch (err) {
        console.error('Erro ao buscar cidades:', err);
        return res.status(500).json({ error: 'Erro ao buscar cidades' });
    }
});

//nova cidade
router.post('/cidade', async (req, res) => {
    try {
        const { nome_cidade } = req.body;
        if (!nome_cidade) return res.status(400).json({ error: 'nome_cidade é obrigatório' });
        const [cidade, created] = await Cidade.findOrCreate({ where: { nome_cidade } });
        return res.status(created ? 201 : 200).json(cidade);
    } catch (err) {
        console.error('Erro ao criar cidade:', err);
        return res.status(500).json({ error: 'Erro ao criar cidade' });
    }
});

//novo endereço
router.post('/endereco', async (req, res) => {
    try {
        const { cep, numero, complemento, fk_Bairro, fk_Cidade, fk_UF } = req.body;
        if (!cep || !fk_Bairro || !fk_Cidade || !fk_UF) {
            return res.status(400).json({ error: 'cep, fk_Bairro, fk_Cidade e fk_UF são obrigatórios' });
        }

        const [endereco, created] = await Endereco.findOrCreate({
            where: { cep, numero, complemento, fk_Bairro, fk_Cidade, fk_UF },
        });

        return res.status(created ? 201 : 200).json(endereco);
    } catch (err) {
        console.error('Erro ao criar endereço:', err);
        return res.status(500).json({ error: 'Erro ao criar endereço' });
    }
});

//! cad cliente
router.post('/cad', async (req, res) => {
    try {
        const { cpf_cliente, nome, endereco, status } = req.body;

        if (!cpf_cliente || !nome) {
            return res.status(400).json({ error: 'cpf_cliente e nome são obrigatórios' });
        }

        
        let fk_endereco = null;
        if (endereco) {
            if (typeof endereco === 'number') {
                fk_endereco = endereco;
            } else if (typeof endereco === 'object') {
                const { cep, numero, complemento, fk_Bairro, fk_Cidade, fk_UF } = endereco;
                if (!cep || !fk_Bairro || !fk_Cidade || !fk_UF) {
                    return res.status(400).json({ error: 'endereco precisa ter cep, fk_Bairro, fk_Cidade e fk_UF' });
                }
                const [end, created] = await Endereco.findOrCreate({
                    where: { cep, numero, complemento, fk_Bairro, fk_Cidade, fk_UF },
                });
                fk_endereco = end.id_Endereco || end.id_Endereco;
            }
        }

        
       
        let statusId = 1;
        if (status !== undefined && status !== null) {
            if (typeof status !== 'number') {
                return res.status(400).json({ error: 'status deve ser um id numérico' });
            }
            statusId = status;
        }

        
        const [cliente, created] = await Cliente.findOrCreate({
            where: { cpf_cliente },
            defaults: { nome, fk_endereco, status: statusId },
        });

        if (!created) return res.status(409).json({ error: 'Cliente com esse CPF já existe' });

        return res.status(201).json(cliente);
    } catch (err) {
        console.error('Erro ao cadastrar cliente:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
});

// cliente por id(cpf)
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, { include: [Endereco, Status] });
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
        return res.status(200).json(cliente);
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        return res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});

//deletar cliente
router.delete('/:id', async (req, res) => {
    try {
        const rows = await Cliente.destroy({ where: { cpf_cliente: req.params.id } });
        if (!rows) return res.status(404).json({ error: 'Cliente não encontrado' });
        return res.status(204).send();
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        return res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
});

//atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const { nome, endereco, status } = req.body;
        let fk_endereco = undefined;
        if (endereco) {
            if (typeof endereco === 'number') fk_endereco = endereco;
            else {
                const { cep, numero, complemento, fk_Bairro, fk_Cidade, fk_UF } = endereco;
                if (!cep || !fk_Bairro || !fk_Cidade || !fk_UF) {
                    return res.status(400).json({ error: 'endereco precisa ter cep, fk_Bairro, fk_Cidade e fk_UF' });
                }
                const [end] = await Endereco.findOrCreate({ where: { cep, numero, complemento, fk_Bairro, fk_Cidade, fk_UF } });
                fk_endereco = end.id_Endereco;
            }
        }

        let statusId = undefined;
        if (status !== undefined && status !== null) {
            if (typeof status !== 'number') {
                return res.status(400).json({ error: 'status deve ser um id numérico' });
            }
            statusId = status;
        }

        const update = {};
        if (nome !== undefined) update.nome = nome;
        if (fk_endereco !== undefined) update.fk_endereco = fk_endereco;
        if (statusId !== undefined) update.status = statusId;

        const [updatedRows] = await Cliente.update(update, { where: { cpf_cliente: req.params.id } });
        if (!updatedRows) return res.status(404).json({ error: 'Cliente não encontrado' });
        const updated = await Cliente.findByPk(req.params.id, { include: [Endereco, Status] });
        return res.status(200).json(updated);
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

module.exports = router;