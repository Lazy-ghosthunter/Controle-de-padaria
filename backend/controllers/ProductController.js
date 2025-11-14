const express = require('express');
const router = express.Router();


const { Produto, Tipo_produto } = require('../models');


router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.findAll();
        return res.status(200).json(produtos);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});


router.get('/tipo', async (req, res) => {
    try {
        const tipos = await Tipo_produto.findAll();
        return res.status(200).json(tipos);
    } catch (err) {
        console.error('Erro ao buscar tipos de produto:', err);
        return res.status(500).json({ error: 'Erro ao buscar tipos' });
    }
});

//nome, cod, un_medida, preco, fk_tipo
router.post('/cad', async (req, res) => {
    try {
        const { nome, un_medida, preco, fk_tipo } = req.body;
        if (!nome || !un_medida || !fk_tipo || preco === undefined) {
            return res.status(400).json({ error: 'por favor insira todos os dados: nome, un_medida, preco, fk_tipo' });
        }

        // Don't require `cod_produto` - it's auto-increment. Check existing product by name+type.
        const exists = await Produto.findOne({ where: { nome, fk_tipo } });
        if (exists) return res.status(409).json({ error: 'Produto já existe' });

        const produto = await Produto.create({ nome, un_medida, preco, fk_tipo });
        return res.status(201).json(produto);
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar produto' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
        return res.status(200).json(produto);
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const rows = await Produto.destroy({ where: { cod_produto: req.params.id } });
        if (!rows) return res.status(404).json({ error: 'Produto não encontrado' });
        return res.status(204).send();
    } catch (err) {
        console.error('Erro ao excluir produto:', err);
        return res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { nome, un_medida, preco, fk_tipo } = req.body;
        const update = {};
        if (nome !== undefined) update.nome = nome;
        if (un_medida !== undefined) update.un_medida = un_medida;
        if (preco !== undefined) update.preco = preco;
        if (fk_tipo !== undefined) update.fk_tipo = fk_tipo;

        const [updatedRows] = await Produto.update(update, { where: { cod_produto: req.params.id } });
        if (!updatedRows) return res.status(404).json({ error: 'Produto não encontrado' });
        const updated = await Produto.findByPk(req.params.id);
        return res.status(200).json(updated);
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

module.exports = router;