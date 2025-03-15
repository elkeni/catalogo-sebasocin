// MobileMenu.jsx
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {isOpen && (
        <div className="mobile-nav">
          <Link to="/explorar">Explorar</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/faqs">FAQs</Link>
          {/* Añadir categorías aquí */}
        </div>
      )}
    </div>
  );
};