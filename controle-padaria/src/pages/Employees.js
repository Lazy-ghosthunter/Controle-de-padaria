import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Employees(){
  const [funcs, setFuncs] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [form, setForm] = useState({ cpf_funcionario:'', nome:'', fk_cargo:'' });
  const [editing, setEditing] = useState(false);

  useEffect(()=>{ fetchFuncs(); fetchCargos(); },[]);

  async function fetchFuncs(){ try{ const r = await api.get('/funcionario'); setFuncs(r.data || []); }catch(e){console.error('Erro fetch funcs', e)} }
  async function fetchCargos(){ try{ const r = await api.get('/funcionario/cargo'); setCargos(r.data || []); }catch(e){console.error('Erro fetch cargos', e)} }

  async function submit(e){
    e.preventDefault();
    try{
      // basic front-end validation and payload shaping
      if (!form.nome || !form.cpf_funcionario) {
        return alert('CPF e Nome são obrigatórios');
      }

      const payload = { nome: form.nome };
      if (form.fk_cargo) payload.fk_cargo = Number(form.fk_cargo);

      if(editing){
        await api.put(`/funcionario/${form.cpf_funcionario}`, payload);
      } else {
        // ensure cpf is sent as string (preserve leading zeros if any)
        const createPayload = { cpf_funcionario: String(form.cpf_funcionario), ...payload };
        if (!createPayload.fk_cargo) return alert('Selecione um cargo');
        await api.post('/funcionario/cad', createPayload);
      }
      setForm({ cpf_funcionario:'', nome:'', fk_cargo:'' });
      setEditing(false);
      fetchFuncs();
    }catch(err){
      alert(err?.response?.data?.error || 'Erro');
    }
  }

  function startEdit(f){ setForm({ cpf_funcionario: f.cpf_funcionario, nome: f.nome, fk_cargo: f.fk_cargo }); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  async function removeFunc(id){ if(!window.confirm('Confirma exclusão do funcionário?')) return; try{ await api.delete(`/funcionario/${id}`); fetchFuncs(); }catch(err){ alert(err?.response?.data?.error || 'Erro'); } }

  return (
    <div className="page">
      <h2>Funcionários</h2>

      <div className="form-panel">
      <form className="simple-form" onSubmit={submit}>
        <input placeholder="CPF" value={form.cpf_funcionario} onChange={e=>setForm({...form, cpf_funcionario:e.target.value})} disabled={editing} />
        <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} />
        <select value={form.fk_cargo} onChange={e=>setForm({...form, fk_cargo: e.target.value})}>
          <option value="">-- Cargo --</option>
          {cargos.map(c=> <option key={c.id_cargo} value={c.id_cargo}>{c.desc_cargo}</option>)}
        </select>
        <button type="submit">{editing? 'Salvar' : 'Criar'}</button>
        {editing && <button type="button" onClick={()=>{ setEditing(false); setForm({ cpf_funcionario:'', nome:'', fk_cargo:'' }); }}>Cancelar</button>}
      </form>
      </div>

      <div className="list">
        <table>
          <thead><tr><th>CPF</th><th>Nome</th><th>Cargo</th><th></th></tr></thead>
          <tbody>
            {funcs.map(f=>{
              const cargo = cargos.find(c=> c.id_cargo === f.fk_cargo);
              return (
                <tr key={f.cpf_funcionario}>
                  <td>{f.cpf_funcionario}</td>
                  <td>{f.nome}</td>
                  <td>{cargo ? cargo.desc_cargo : f.fk_cargo}</td>
                  <td>
                    <button className="btn ghost small" onClick={()=>startEdit(f)}>Editar</button>
                    <button className="btn danger small" onClick={()=>removeFunc(f.cpf_funcionario)}>Excluir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
