import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Sales(){
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [pagamentosError, setPagamentosError] = useState('');
  const [fk_tipoPagamento, setPagamento] = useState('');
  const [fk_responsavel, setResponsavel] = useState('');
  const [funcionarios, setFuncionarios] = useState([]);
  const [fk_cliente, setCliente] = useState('');

  useEffect(()=>{ fetchProducts() },[]);
  useEffect(()=>{ fetchPagamentos() },[]);
  useEffect(()=>{ fetchFuncionarios() },[]);
  async function fetchProducts(){ try{ const r = await api.get('/produto'); setProducts(r.data || []) }catch(e){console.error(e)} }
  async function fetchPagamentos(){
    try{
      const r = await api.get('/venda/pagamentos');
      setPagamentos(r.data || []);
      setPagamentosError('');
    }catch(e){
      console.error('err pagamentos',e);
      setPagamentos([]);
      setPagamentosError(String(e?.response?.data?.error || e.message || 'Erro'));
    }
  }
  // auto-select first pagamento when available
  useEffect(()=>{
    if(pagamentos.length && !fk_tipoPagamento){
      setPagamento(String(pagamentos[0].id_tipo));
    }
  },[pagamentos]);
  async function fetchFuncionarios(){ try{ const r = await api.get('/funcionario'); setFuncionarios(r.data || []); }catch(e){console.error('err funcionarios',e)} }
  useEffect(()=>{
    if(funcionarios.length && !fk_responsavel){
      setResponsavel(String(funcionarios[0].cpf_funcionario));
    }
  },[funcionarios]);
  function addItem(prod){
    const inst = { id: Date.now() + Math.random(), fk_codProduto: prod.cod_produto, quantidade:1, nome: prod.nome };
    setItems(prev => [...prev, inst]);
  }
  function updateQty(i,q){ const c=[...items]; c[i].quantidade = Number(q); setItems(c) }

  async function submit(e){
    e.preventDefault();
    // client-side validation
    if(!items || items.length === 0) return alert('Adicione ao menos um item à venda');
    if(!fk_responsavel) return alert('Selecione o responsável');
    if(!fk_tipoPagamento) return alert('Selecione o tipo de pagamento');

    // ensure items payload shape
    const payloadItems = items.map(it=> ({ fk_codProduto: Number(it.fk_codProduto), quantidade: Number(it.quantidade) }));

    try{
      const body = { fk_responsavel: Number(fk_responsavel), fk_tipoPagamento: Number(fk_tipoPagamento), fk_cliente: fk_cliente?Number(fk_cliente):undefined, items: payloadItems };
      const r = await api.post('/venda/cad', body);
      alert('Venda criada. Total: '+r.data.total);
      setItems([]);
    }catch(err){ alert(err?.response?.data?.error || 'Erro') }
  }

  return (
    <div className="page">
      <h2>Vendas</h2>
      <div className="sales-grid">
        <div>
          <h3>Produtos</h3>
          <div className="products-list">
            {products.map(p=> (
              <div key={p.cod_produto} className="product-card">
                <div>{p.nome}</div>
                <div>R$ {p.preco}</div>
                <button onClick={()=>addItem(p)}>Adicionar</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Itens da venda</h3>
          <form onSubmit={submit} className="simple-form">
            <input placeholder="CPF cliente (se credito)" value={fk_cliente} onChange={e=>setCliente(e.target.value)} />
            <select value={fk_responsavel} onChange={e=>setResponsavel(e.target.value)}>
              <option value="">-- Responsável --</option>
              {funcionarios.map(f=> (<option key={f.cpf_funcionario} value={f.cpf_funcionario}>{f.nome} ({f.cpf_funcionario})</option>))}
            </select>
            <select value={fk_tipoPagamento} onChange={e=>setPagamento(e.target.value)}>
              {pagamentos.length===0 && <option value="">{pagamentosError ? 'Erro ao carregar tipos' : 'Nenhum tipo disponível'}</option>}
              {pagamentos.map(p=> (<option key={p.id_tipo} value={p.id_tipo}>{p.desc_tipo}</option>))}
            </select>
            <div className="items-list">
              {items.map((it,i)=> (
                <div key={it.id} className="item-row">
                  <span>{it.nome} (#{it.fk_codProduto})</span>
                  <input type="number" value={it.quantidade} onChange={e=>updateQty(i,e.target.value)} />
                </div>
              ))}
            </div>
            <button type="submit">Finalizar Venda</button>
          </form>
        </div>
      </div>
    </div>
  )
}
