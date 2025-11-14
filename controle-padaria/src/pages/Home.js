import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="page">
      <div className="app-main home-center">
        <header className="hero" style={{textAlign:'center'}}>
          <h1>Padaria Controle</h1>
          <p>✵Gerenciamento de clientes, produtos e vendas.✵</p>
        </header>
        <section className="cards" style={{justifyContent:'center'}}>
          <Link to="/clients" className="card card-link">Clientes<br/><small>Gerencie cadastros e endereços</small></Link>
          <Link to="/products" className="card card-link">Produtos<br/><small>Cadastro e preços</small></Link>
          <Link to="/sales" className="card card-link">Vendas<br/><small>Registro de vendas e crédito</small></Link>
        </section>
      </div>
    </div>
  )
}
