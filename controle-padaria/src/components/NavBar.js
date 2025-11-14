import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <img src={process.env.PUBLIC_URL + '/imgs/Logo padaria.svg'} alt="Logo Padaria" className="nav-logo" />
        <div className="brand-text">Padaria • Controle</div>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/clients">Clientes</NavLink></li>
        <li><NavLink to="/employees">Funcionários</NavLink></li>
        <li><NavLink to="/products">Produtos</NavLink></li>
        <li><NavLink to="/sales">Vendas</NavLink></li>
      </ul>
    </nav>
  );
}
