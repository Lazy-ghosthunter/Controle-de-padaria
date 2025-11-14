const express = require('express');
const router = express.Router();


const { Funcionario, Cargo } = require('../models');


router.get('/', async (req, res) => {
    try {
        const funcionarios = await Funcionario.findAll();
        return res.status(200).json(funcionarios);
    } catch (err) {
        console.error('Erro ao buscar funcionários:', err);
        return res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
});


router.get('/cargo', async (req, res) => {
    try {
        const cargos = await Cargo.findAll();
        return res.status(200).json(cargos);
    } catch (err) {
        console.error('Erro ao buscar cargos:', err);
        return res.status(500).json({ error: 'Erro ao buscar cargos' });
    }
});


router.post('/cad', async (req, res) => {
    try {
        const { cpf_funcionario, nome, fk_cargo } = req.body;
        if (!cpf_funcionario || !nome || !fk_cargo) {
            return res.status(400).json({ error: 'cpf_funcionario, nome e fk_cargo são obrigatórios' });
        }

        const [func, created] = await Funcionario.findOrCreate({
            where: { cpf_funcionario },
            defaults: { nome, fk_cargo },
        });

        if (!created) {
            return res.status(409).json({ error: 'Funcionário com esse CPF já existe' });
        }

        return res.status(201).json(func);
    } catch (err) {
        console.error('Erro ao cadastrar funcionário:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.id);
        if (!funcionario) return res.status(404).json({ error: 'Funcionário não encontrado' });
        return res.status(200).json(funcionario);
    } catch (err) {
        console.error('Erro ao buscar funcionário:', err);
        return res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const rows = await Funcionario.destroy({ where: { cpf_funcionario: req.params.id } });
        if (!rows) return res.status(404).json({ error: 'Funcionário não encontrado' });
        return res.status(204).send();
    } catch (err) {
        console.error('Erro ao excluir funcionário:', err);
        return res.status(500).json({ error: 'Erro ao excluir funcionário' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { nome, fk_cargo } = req.body;
        const [updatedRows] = await Funcionario.update(
            { nome, fk_cargo },
            { where: { cpf_funcionario: req.params.id } }
        );
        if (!updatedRows) return res.status(404).json({ error: 'Funcionário não encontrado' });
        const updated = await Funcionario.findByPk(req.params.id);
        return res.status(200).json(updated);
    } catch (err) {
        console.error('Erro ao atualizar funcionário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
});

module.exports = router;