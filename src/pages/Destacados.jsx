import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import '../styles/Destacados.css'; // Asegúrate de que los estilos sean consistentes

const Destacados = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Cargar productos destacados desde el JSON
    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const response = await fetch('/Destacados.json');
                if (!response.ok) {
                    throw new Error('Error al cargar los productos destacados');
                }
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error('Error al cargar los productos destacados:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDestacados();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main className="catalog-container">
            {/* Header */}
            <header className="catalog-header">
                <div className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                </div>
                <div className="logo-container">
                    <img src="/logo.png" alt="Logo Sebasocin Hnos" className="logo-img" />
                    <h1 className="logo-text">SEBASOCIN HNOS</h1>
                </div>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Buscar productos..." className="search-bar" />
                </div>
            </header>

            {/* Contenido principal */}
            <section className="catalog-content">
                <h2 className="destacados-titulo">Productos Destacados</h2>
                <div className="product-grid">
                    {productos.map((producto) => {
                        let cleanPrice = producto.precio?.toString().replace("S/", "").replace(",", "").trim();
                        let numericPrice = parseFloat(cleanPrice);

                        return (
                            <div className="product-card" key={producto.id}>
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="product-img"
                                    onError={(e) => (e.target.src = '/placeholder.png')} // Imagen por defecto
                                />
                                <div className="product-info">
                                    <div className="product-title">{producto.nombre}</div>
                                    <div className="product-price">
                                        {!isNaN(numericPrice)
                                            ? numericPrice.toLocaleString("es-PE", {
                                                style: "currency",
                                                currency: "PEN",
                                            })
                                            : producto.precio || "Precio no disponible"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
};

export default Destacados;