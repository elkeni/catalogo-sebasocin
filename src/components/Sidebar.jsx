import React from 'react';
import './catalogo.css';

const Sidebar = () => {
    const categories = ['Laptops', 'PCs', 'Impresoras', 'Accesorios', 'Suministros'];
    
    return (
        <aside className="sidebar">
            {categories.map((category, index) => (
                <div key={index} className="sidebar-item">{category}</div>
            ))}
        </aside>
    );
};

export default Sidebar;
