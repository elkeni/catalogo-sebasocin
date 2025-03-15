// src/pages/SobreNosotros.jsx
import React from "react";
import "../styles/sobrenosotros.css";

const SobreNosotros = () => {
  return (
    <div className="about-container">
      <section className="about-header">
        <img src="/logoazul.png" alt="Logo Sebasocin" className="about-logo" />
        <h1>Sobre Nosotros</h1>
        <p>
          <span>SEBASOCIN HNOS E.I.R.L.</span> es una empresa peruana dedicada a la venta y distribución de artículos de librería, oficina, equipos de cómputo, suministros y más. Nos respaldamos en la legislación de la micro y pequeña empresa del Perú, garantizando productos y servicios de calidad.
        </p>
      </section>

      <section className="about-content">
        <h2>Nuestro Propósito</h2>
        <p>
          Ofrecer soluciones tecnológicas y de consumo masivo para empresas y hogares, a través de la comercialización de productos variados y servicios como asesorías, mantenimiento y transporte.
        </p>

        <h2>Nuestros Servicios</h2>
        <ul>
          <li>📌 Venta de artículos de librería y equipos de cómputo</li>
          <li>📌 Distribución de productos de consumo masivo y limpieza</li>
          <li>📌 Asesoría comercial y mantenimiento de maquinarias</li>
          <li>📌 Servicios de impresión y gigantografías</li>
          <li>📌 Importación y exportación de bienes y servicios</li>
          <li>📌 Consultoría en proyectos de ingeniería de sistemas</li>
        </ul>

        <h2>Nuestros Valores</h2>
        <ul>
          <li>📌 Compromiso con la calidad</li>
          <li>📌 Transparencia y confianza</li>
          <li>📌 Innovación constante</li>
        </ul>

        <h2>Contacto</h2>
        <p>📞 +51 999 999 999</p>
        <p>📧 contacto@sebasocin.com</p>
        <p>📍 Domicilio: Manzana A, Sin Urbanización, Miguel Grau III Etapa, Distrito de Casa Grande, La Libertad, Perú.</p>
      </section>
    </div>
  );
};

export default SobreNosotros;
