import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import "../styles/Menu.css";

const Menu = () => {
  
  return (
    <div className="menu-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/explorar">Explorar</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/faqs">FAQs</Link>
      </nav>

      {/* Sección Izquierda - Texto */}
      <section className="menu-left">
        <header>
          <img src="/logoazul.png" alt="Logo" className="logo" />
        </header>

        <div>
          <h1>
            Bienvenido a <span>SEBASOCIN</span>,<br /> un gusto verte de nuevo
          </h1>
          <p>
            En Sebasocin, ofrecemos una amplia variedad de tecnología, suministros y productos esenciales para empresas y hogares, con los mejores proveedores del mercado.
          </p>
          <Link to="/catalogo" className="contact-button">
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Sección Derecha - Imagen */}
      <section className="menu-right">
        <div className="highlight-box">
          <img src="/suministros.jpg" alt="Productos Destacados" className="highlight-image" />
          <div className="tag clean-air">Variedad</div>
          <div className="tag fresh-ecology">Calidad Garantizada</div>
          <div className="social-icons">
            <FaFacebook />
            <FaTiktok />
            <FaYoutube />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
