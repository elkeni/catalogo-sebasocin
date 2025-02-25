import React from 'react';
import './catalogo.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">Sebasocin Hnos.</div>
            <input type="text" className="search-bar" placeholder="Buscar productos..." />
        </header>
    );
};

export default Header;
