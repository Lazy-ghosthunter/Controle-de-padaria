const express = require('express');
const router = express.Router();


const { Venda, Cliente, Produto, Funcionario, Pagamento, Item_venda } = require('../models');


// List vendas
router.get('/', async (req, res) => {
    try {
        const vendas = await Venda.findAll();
        return res.status(200).json(vendas);
    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        return res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
});


// Get venda por id
router.get('/:id', async (req, res) => {
    try {
        const venda = await Venda.findByPk(req.params.id);
        if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });

        const items = await Item_venda.findAll({ where: { fk_codVenda: venda.cod_venda } });
        return res.status(200).json({ venda, items });
    } catch (err) {
        console.error('Erro ao buscar venda:', err);
        return res.status(500).json({ error: 'Erro ao buscar venda' });
    }
});


//Nova venda
router.post('/cad', async (req, res) => {
    try {
        const { fk_responsavel, fk_tipoPagamento, items, fk_cliente } = req.body;
        if (!fk_responsavel || !fk_tipoPagamento || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'fk_responsavel, fk_tipoPagamento e items são obrigatórios' });
        }

        // Calculate total
        let total = 0;
        for (const it of items) {
            if (!it.fk_codProduto || typeof it.quantidade !== 'number') {
                return res.status(400).json({ error: 'cada item precisa ter fk_codProduto e quantidade (número)' });
            }
            const prod = await Produto.findByPk(it.fk_codProduto);
            if (!prod) {
                return res.status(400).json({ error: `Produto ${it.fk_codProduto} não encontrado` });
            }
            total += parseFloat(prod.preco) * it.quantidade;
        }

        //checando o credito do cliente
        const pagamento = await Pagamento.findByPk(fk_tipoPagamento);
        if (!pagamento) {
            return res.status(400).json({ error: 'Tipo de pagamento inválido' });
        }

        if (String(pagamento.desc_tipo).toLowerCase() === 'crédito' || String(pagamento.desc_tipo).toLowerCase() === 'credito') {
            if (!fk_cliente) {
                return res.status(400).json({ error: 'Para pagamento por Crédito é necessário informar fk_cliente' });
            }
            const cliente = await Cliente.findByPk(fk_cliente);
            if (!cliente) {
                return res.status(400).json({ error: 'Cliente informado não encontrado' });
            }
            const credito = parseFloat(cliente.credito || 0);
            if (credito < total) {
                return res.status(400).json({ error: 'Crédito insuficiente para esta compra' });
            }
            
            const novoCredito = (credito - total).toFixed(2);
            await Cliente.update({ credito: novoCredito }, { where: { cpf_cliente: cliente.cpf_cliente } });
        }

        // create Venda
        const venda = await Venda.create({ fk_responsavel, fk_tipoPagamento });

        // create item_venda
        const createdItems = [];
        for (const it of items) {
            const newItem = await Item_venda.create({ fk_codVenda: venda.cod_venda, fk_codProduto: it.fk_codProduto, quantidade: it.quantidade });
            createdItems.push(newItem);
        }

        return res.status(201).json({ venda, items: createdItems, total });
    } catch (err) {
        console.error('Erro ao cadastrar venda:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar venda' });
    }
});

module.exports = router;