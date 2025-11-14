import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Clients(){
  const [clientes, setClientes] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState({
    cpf_cliente:'', nome:'', status:'', credito:'', endereco: { cep:'', numero:'', complemento:'', fk_UF:'', fk_Cidade:'', fk_Bairro:'', nome_cidade:'', nome_bairro:'' }
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetchClients(); fetchUfs(); fetchCidades(); fetchBairros(); },[]);
  useEffect(()=>{ fetchStatuses(); },[]);

  async function fetchClients(){
    setLoading(true);
    try{ const res = await api.get('/cliente'); setClientes(res.data || []); }
    catch(e){ console.error(e) }
    setLoading(false);
  }

  async function createClient(e){
    e.preventDefault();
    try{
      // prepare endereco if user filled cep or any address field
      const addr = form.endereco || {};
      let enderecoObj = null;
      if (addr.cep || addr.numero || addr.fk_UF || addr.fk_Cidade || addr.fk_Bairro || addr.nome_cidade || addr.nome_bairro) {
        // ensure fk_Cidade and fk_Bairro exist (create if names provided)
        let fkCidade = addr.fk_Cidade;
        let fkBairro = addr.fk_Bairro;

        if (!fkCidade && addr.nome_cidade) {
          const r = await api.post('/cliente/cidade', { nome_cidade: addr.nome_cidade });
          fkCidade = r.data.id_Cidade || r.data.id_Cidade;
        }

        if (!fkBairro && addr.nome_bairro) {
          const r2 = await api.post('/cliente/bairro', { nome_bairro: addr.nome_bairro });
          fkBairro = r2.data.id_Bairro || r2.data.id_Bairro;
        }

        enderecoObj = {
          cep: addr.cep,
          numero: addr.numero ? Number(addr.numero) : null,
          complemento: addr.complemento,
          fk_Bairro: fkBairro,
          fk_Cidade: fkCidade,
          fk_UF: addr.fk_UF
        };
      }

      if (editing) {
        // build update body (do not send cpf_cliente)
        const body = {};
        if (form.nome !== undefined) body.nome = form.nome;
        if (form.status !== undefined && form.status !== '') body.status = Number(form.status);
        if (form.credito !== undefined && form.credito !== '') body.credito = Number(form.credito);
        if (enderecoObj) body.endereco = enderecoObj;
        await api.put(`/cliente/${form.cpf_cliente}`, body);
      } else {
        const body = { cpf_cliente: String(form.cpf_cliente), nome: form.nome };
        if (form.status !== undefined && form.status !== '') body.status = Number(form.status);
        if (form.credito !== undefined && form.credito !== '') body.credito = Number(form.credito);
        if (enderecoObj) body.endereco = enderecoObj;
        await api.post('/cliente/cad', body);
      }

      setForm({ cpf_cliente:'', nome:'', endereco: { cep:'', numero:'', complemento:'', fk_UF:'', fk_Cidade:'', fk_Bairro:'', nome_cidade:'', nome_bairro:'' } });
      setEditing(false);
      fetchClients();
    }catch(err){ alert(err?.response?.data?.error || 'Erro'); }
  }

  async function fetchUfs(){ try{ const r = await api.get('/cliente/UF'); setUfs(r.data || []); }catch(e){console.error('Erro UFs', e)} }
  async function fetchCidades(){ try{ const r = await api.get('/cliente/cidades'); setCidades(r.data || []); }catch(e){console.error('Erro cidades', e)} }
  async function fetchBairros(){ try{ const r = await api.get('/cliente/bairros'); setBairros(r.data || []); }catch(e){console.error('Erro bairros', e)} }
  async function fetchStatuses(){ try{ const r = await api.get('/cliente/status'); setStatuses(r.data || []); }catch(e){console.error('Erro status', e)} }

  async function startEdit(client){
    try{
      // fetch full cliente (includes Endereco when present)
      const r = await api.get(`/cliente/${client.cpf_cliente}`);
      const data = r.data || {};

      // The included Endereco may appear under different property names depending on Sequelize config
      let end = data.Endereco || data.endereco || null;
      if (!end) {
        // try to find an object-valued property that looks like an address (has 'cep')
        for (const v of Object.values(data)) {
          if (v && typeof v === 'object' && 'cep' in v) { end = v; break; }
        }
      }

      // try to map city/bairro names if we have lists
      const nome_cidade = end && end.fk_Cidade ? (cidades.find(c=> c.id_Cidade === end.fk_Cidade)?.nome_cidade || '') : '';
      const nome_bairro = end && end.fk_Bairro ? (bairros.find(b=> b.id_Bairro === end.fk_Bairro)?.nome_bairro || '') : '';

      setEditing(true);
      setForm({
        cpf_cliente: data.cpf_cliente || client.cpf_cliente,
        nome: data.nome || client.nome || '',
        status: data.status ?? client.status ?? '',
        credito: data.credito ?? client.credito ?? '',
        endereco: {
          cep: end && 'cep' in end ? (end.cep || '') : '',
          numero: end && 'numero' in end ? (end.numero ?? '') : '',
          complemento: end && 'complemento' in end ? (end.complemento || '') : '',
          fk_UF: end && 'fk_UF' in end ? (end.fk_UF ?? '') : '',
          fk_Cidade: end && 'fk_Cidade' in end ? (end.fk_Cidade ?? '') : '',
          fk_Bairro: end && 'fk_Bairro' in end ? (end.fk_Bairro ?? '') : '',
          nome_cidade,
          nome_bairro
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }catch(err){
      console.error('Erro ao carregar cliente para edição', err);
      // fallback: fill minimal data
      setEditing(true);
      setForm({ cpf_cliente: client.cpf_cliente, nome: client.nome || '', status: client.status || '', credito: client.credito || '', endereco: { cep:'', numero:'', complemento:'', fk_UF:'', fk_Cidade:'', fk_Bairro:'', nome_cidade:'', nome_bairro:'' } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function cancelEdit(){ setEditing(false); setForm({ cpf_cliente:'', nome:'', endereco: { cep:'', numero:'', complemento:'', fk_UF:'', fk_Cidade:'', fk_Bairro:'', nome_cidade:'', nome_bairro:'' } }); }

  return (
    <div className="page">
      <h2>Clientes</h2>
      <div className="form-panel">
      <form className="simple-form clients-form" onSubmit={createClient}>
        <div className="form-row">
          <input placeholder="CPF" value={form.cpf_cliente} onChange={e=>setForm({...form, cpf_cliente:e.target.value})} />
          <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} />
        </div>

        <div className="form-row">
          <input placeholder="CEP" value={form.endereco.cep} onChange={e=>setForm({...form, endereco:{...form.endereco, cep:e.target.value}})} />
          <input placeholder="Número" value={form.endereco.numero} onChange={e=>setForm({...form, endereco:{...form.endereco, numero:e.target.value}})} />
          <input placeholder="Complemento" value={form.endereco.complemento} onChange={e=>setForm({...form, endereco:{...form.endereco, complemento:e.target.value}})} />
        </div>

        <div className="form-row">
          <select className="small" value={form.status ?? ''} onChange={e=>setForm({...form, status: e.target.value ? Number(e.target.value) : ''})}>
            <option value="">-- Status --</option>
            {statuses.map(s=> <option key={s.id_status} value={s.id_status}>{s.desc}</option>)}
          </select>
          <input placeholder="Crédito" value={form.credito ?? ''} onChange={e=>setForm({...form, credito: e.target.value})} />
        </div>

        <div className="form-row">
          <select className="small" value={form.endereco.fk_UF} onChange={e=>setForm({...form, endereco:{...form.endereco, fk_UF: e.target.value ? Number(e.target.value) : ''}})}>
            <option value="">-- Estado (UF) --</option>
            {ufs.map(u=> <option key={u.id_UF} value={u.id_UF}>{u.nome_UF}</option>)}
          </select>

          <input placeholder="Cidade (ou digite)" list="cidades" value={form.endereco.nome_cidade} onChange={e=>setForm({...form, endereco:{...form.endereco, nome_cidade:e.target.value, fk_Cidade:''}})} />
          <datalist id="cidades">{cidades.map(c=> <option key={c.id_Cidade} value={c.nome_cidade} />)}</datalist>

          <input placeholder="Bairro (ou digite)" list="bairros" value={form.endereco.nome_bairro} onChange={e=>setForm({...form, endereco:{...form.endereco, nome_bairro:e.target.value, fk_Bairro:''}})} />
          <datalist id="bairros">{bairros.map(b=> <option key={b.id_Bairro} value={b.nome_bairro} />)}</datalist>
        </div>

        <div style={{display:'flex', gap:8}}>
          <button type="submit">{editing? 'Salvar' : 'Criar'}</button>
          {editing && <button type="button" onClick={cancelEdit} className="btn ghost small">Cancelar</button>}
        </div>
      </form>
      </div>

      <div className="list">
        {loading? <p>Carregando...</p> : (
          <table>
            <thead><tr><th>CPF</th><th>Nome</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {clientes.map(c=> {
                const s = statuses.find(x=> x.id_status === c.status);
                const statusDesc = s ? s.desc : c.status;
                return (<tr key={c.cpf_cliente}>
                  <td>{c.cpf_cliente}</td>
                  <td>{c.nome}</td>
                  <td>{statusDesc}</td>
                  <td>
                    <button className="btn ghost small" onClick={()=>startEdit(c)}>Editar</button>
                  </td>
                </tr>)
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
