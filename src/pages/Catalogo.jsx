import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaArrowUp, FaArrowLeft } from "react-icons/fa";
import "../styles/catalogo.css";

const Catalogo = () => {
  const [activeCategory, setActiveCategory] = useState("Ver Todo");
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState("Destacados");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;

  useEffect(() => {
    fetchProductos("Ver Todo");
  }, []);

  const categories = [
    "Ver Todo", "Escolar", "Oficina", "Tecnología", "Universitario",
    "Cuidado Personal y Limpieza", "Electrohogar",
    "Mascotas", "Outdoors y Deporte"
  ];

  const fetchProductos = async (category) => {
    let archivos = [];

    if (category === "Ver Todo") {
      archivos = [
        "escolar.json", "oficina.json", "tecnologia.json", "universitario.json",
        "cuidado-personal-limpieza.json", "electrohogar.json",
        "mascotas.json", "outdoors-deporte.json"
      ];
    } else {
      let fileName = category
        .trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s*y\s*/g, "y")
        .replace(/\s+/g, "-") + ".json";

      if (category === "Outdoors y Deporte") fileName = "outdoors-deporte.json";
      if (category === "Cuidado Personal y Limpieza") fileName = "cuidado-personal-limpieza.json";

      archivos = [fileName];
    }

    try {
      let productosCargados = [];

      for (let archivo of archivos) {
        const response = await fetch(`/${archivo}`);
        if (!response.ok) throw new Error(`Error ${response.status}: No se encontró ${archivo}`);

        const data = await response.json();
        productosCargados = [
          ...productosCargados,
          ...data.map((item, index) => ({
            id: productosCargados.length + index + 1,
            name: item.nombre,
            price: parseFloat(item.precio.replace("S/", "").trim()),
            img: item.imagenURL,
            brand: item.marca,
            category: item.categoria,
            features: item.caracteristicas || [],
            availability: item.disponibilidad
          }))
        ];
      }

      setProductos(productosCargados);
      setFilteredProducts(productosCargados);
      setCurrentPage(1); // Reiniciar a la primera página cuando se cambia de categoría
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    fetchProductos(categoryName);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    document.body.classList.add("modal-open"); // Evita el scroll de fondo
  };
  
  const closeModal = () => {
    setSelectedProduct(null);
    document.body.classList.remove("modal-open"); // Restaura el scroll
  };
  
  

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    let sortedProducts = [...filteredProducts];

    switch (option) {
      case "Nombre del Producto":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Precio":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  };
  

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <main className="catalog-container">
      <header className="catalog-header">
        <div className="back-button" onClick={() => window.history.back()}>
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

      <section className="banner">
        <h2>EXPLORA NUESTRA COLECCIÓN</h2>
        <p>Todo lo que necesitas para tu hogar y oficina en un solo lugar.</p>
        <button className="highlight-button">Ver Destacados</button>
      </section>

      <aside className="sidebar">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category ${activeCategory === category ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category} <FaChevronDown className="category-icon" />
          </div>
        ))}
      </aside>

      <section className="catalog-content">
        <div className="filters">
          <div className="sort-dropdown">
            <FaArrowUp className="sort-icon" />
            <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option>Relevancia</option>
              <option>Precio</option>
              <option>Nombre del Producto</option>
            </select>
          </div>
        </div>

        {selectedProduct && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{selectedProduct.name}</h2>
      <img src={selectedProduct.img} alt={selectedProduct.name} />
      <p><strong>Precio:</strong> S/ {selectedProduct.price.toFixed(2)}</p>
      <p><strong>Marca:</strong> {selectedProduct.brand}</p>
      <p><strong>Características:</strong></p>
      <ul>
        {selectedProduct.features.length > 0 ? (
          selectedProduct.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))
        ) : (
          <li>No especificadas</li>
        )}
      </ul>
      <p><strong>Disponibilidad:</strong> {selectedProduct.availability}</p>
    </div>
  </div>
)}


        <div className="product-grid">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                <img src={product.img} alt={product.name} className="product-img" />
                <div className="product-info">
                  <div className="product-title">{product.name}</div>
                  <div className="product-price">S/ {product.price.toFixed(2)}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No hay productos en esta categoría.</p>
          )}
        </div>

        {/* 🔹 Controles de paginación */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      </section>
    </main>
  );
};

export default Catalogo;
