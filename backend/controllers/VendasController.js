const express = require('express');
const router = express.Router();


const { Venda, Cliente, Produto, Funcionario, Pagamento, Item_venda, sequelize } = require('../models');


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

// Lista tipos de pagamento (para popular dropdown no frontend)
router.get('/pagamentos', async (req, res) => {
    try {
        const pagamentos = await Pagamento.findAll({ attributes: ['id_tipo', 'desc_tipo'], order: [['id_tipo', 'ASC']] });
        return res.status(200).json(pagamentos);
    } catch (err) {
        console.error('Erro ao buscar tipos de pagamento:', err);
        return res.status(500).json({ error: 'Erro ao buscar tipos de pagamento' });
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
        let { fk_responsavel, fk_tipoPagamento, items, fk_cliente } = req.body;
        // normalize numeric ids
        fk_responsavel = Number(fk_responsavel);
        fk_tipoPagamento = Number(fk_tipoPagamento);
        fk_cliente = fk_cliente !== undefined && fk_cliente !== null ? Number(fk_cliente) : undefined;

        if (!fk_responsavel || !fk_tipoPagamento || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'fk_responsavel, fk_tipoPagamento e items são obrigatórios' });
        }

        console.log('Novo pedido de venda recebido:', { fk_responsavel, fk_tipoPagamento, fk_cliente, items });

        // validate responsible exists
        const funcionario = await Funcionario.findByPk(fk_responsavel);
        if (!funcionario) return res.status(400).json({ error: 'Funcionário (fk_responsavel) não encontrado' });

        // Calculate total and validate items
        let total = 0;
        for (const it of items) {
            const fk = Number(it.fk_codProduto);
            const qt = Number(it.quantidade);
            if (!fk || !Number.isFinite(qt) || qt <= 0) {
                return res.status(400).json({ error: 'cada item precisa ter fk_codProduto válido e quantidade (número > 0)' });
            }
            const prod = await Produto.findByPk(fk);
            if (!prod) {
                return res.status(400).json({ error: `Produto ${fk} não encontrado` });
            }
            total += parseFloat(prod.preco) * qt;
            // normalize item
            it.fk_codProduto = fk;
            it.quantidade = qt;
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

        // create Venda + items inside a transaction
        const t = await sequelize.transaction();
        try{
            const venda = await Venda.create({ fk_responsavel, fk_tipoPagamento }, { transaction: t });
            const createdItems = [];
            for (const it of items) {
                const newItem = await Item_venda.create({ fk_codVenda: venda.cod_venda, fk_codProduto: it.fk_codProduto, quantidade: it.quantidade }, { transaction: t });
                createdItems.push(newItem);
            }
            await t.commit();
            return res.status(201).json({ venda, items: createdItems, total });
        }catch(innerErr){
            await t.rollback();
            console.error('Erro criando venda dentro da transação:', innerErr);
            return res.status(500).json({ error: innerErr.message });
        }
    } catch (err) {
        console.error('Erro ao cadastrar venda:', err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;