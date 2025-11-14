import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Products(){
  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nome:'', un_medida:'un', preco:'', fk_tipo: '' });

  useEffect(()=>{ fetchProducts(); fetchTipos(); },[]);
  async function fetchProducts(){ try{ const r = await api.get('/produto'); setProdutos(r.data || []) }catch(e){console.error(e)} }
  async function fetchTipos(){
    try{
      const r = await api.get('/produto/tipo');
      const list = r.data || [];
      setTipos(list);
      // se não houver tipo selecionado, prefira o primeiro disponível
      if(list.length && !form.fk_tipo) setForm(f => ({...f, fk_tipo: list[0].id_tipo}));
    }catch(e){
      console.error('Erro fetch tipos', e)
    }
  }

  async function create(e){
    e.preventDefault();
    try{
      await api.post('/produto/cad', { nome:form.nome, un_medida:form.un_medida, preco: Number(form.preco), fk_tipo: Number(form.fk_tipo) });
      setForm({ nome:'', un_medida:'un', preco:'', fk_tipo: tipos.length ? tipos[0].id_tipo : 1 });
      fetchProducts();
    }catch(err){ alert(err?.response?.data?.error || 'Erro') }
  }

  return (
    <div className="page">
      <h2>Produtos</h2>
      <div className="form-panel">
      <form className="simple-form" onSubmit={create}>
        <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} />
        <input placeholder="Unidade" value={form.un_medida} onChange={e=>setForm({...form, un_medida:e.target.value})} />
        <input placeholder="Preco" value={form.preco} onChange={e=>setForm({...form, preco:e.target.value})} />
        <select value={form.fk_tipo} onChange={e=>setForm({...form, fk_tipo: e.target.value ? Number(e.target.value) : ''})}>
          {tipos.length === 0 && <option value="">Nenhum tipo disponível</option>}
          {tipos.length > 0 && <option value="">-- Escolha o tipo --</option>}
          {tipos.map(t=> <option key={t.id_tipo} value={t.id_tipo}>{t.desc_tipo}</option>)}
        </select>
        <button type="submit" disabled={tipos.length === 0}>Criar</button>
      </form>
      </div>

      <div className="list">
        <table>
          <thead><tr><th>Id</th><th>Nome</th><th>Un</th><th>Preço</th></tr></thead>
          <tbody>
            {produtos.map(p=> (<tr key={p.cod_produto}><td>{p.cod_produto}</td><td>{p.nome}</td><td>{p.un_medida}</td><td>{p.preco}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
