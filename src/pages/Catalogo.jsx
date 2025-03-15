import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronDown, FaArrowUp, FaArrowLeft } from "react-icons/fa";
import "../styles/catalogo.css";

const Catalogo = () => {
  const navigate = useNavigate();  // Mueve esto fuera y elimina el bloque innecesario

  // Estados
  const [activeCategory, setActiveCategory] = useState("Ver Todo");
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState("Destacados");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBanner, setShowBanner] = useState(true);
  const productsPerPage = 25;
  const [searchTerm, setSearchTerm] = useState("");
  

  // Categorías disponibles
  const categories = [
    "Ver Todo", "Escolar", "Oficina", "Tecnología", "Universitario",
    "Cuidado Personal y Limpieza", "Electrohogar",
    "Mascotas", "Outdoors y Deporte"
  ];

  // Diccionario de sinónimos
  const sinonimos = {
    bolígrafo: ["lapicero", "lapiceros", "pluma", "esfero", "boli", "birome"],
    cuaderno: ["libreta", "notebook", "agenda", "bloc", "carpeta"],
    computadora: ["pc", "ordenador", "laptop", "computador", "notebook", "equipo"],
    mascarilla: ["tapabocas", "cubrebocas", "barbijo", "mascarillas", "protector facial"],
    detergente: ["jabón", "limpiador", "jabón en polvo", "detergentes"],
    goma: ["pegamento", "adhesivo", "cola", "resistol"],
    clips: ["sujetapapeles", "clip", "engrapador", "broche"],
    tijeras: ["cortador", "cizalla", "tijera"],
    lápiz: ["lapicero", "portaminas", "grafito", "lapices"],
    borrador: ["goma", "borradores", "borratina", "corrector"],
    regla: ["escuadra", "medidor", "reglas", "cinta métrica"],
    folder: ["carpeta", "archivador", "sobres", "portafolio"],
    papel: ["hoja", "folios", "cartulina", "papeles"],
    mandil: ["delantal", "bata", "protector", "uniforme"],
    guantes: ["manoplas", "protección", "guante", "guantillas"],
    gorro: ["sombrero", "cofia", "gorrito", "cubre-cabeza"],
    escoba: ["cepillo", "barrendero", "escobillón"],
    recogedor: ["pala", "recogedor de basura", "paleta"],
    bolsa: ["saco", "funda", "bolsas", "envoltura"],
    jabón: ["detergente", "limpiador", "jabones"],
    lejía: ["cloro", "blanqueador", "desinfectante"],
    ácido: ["muriático", "limpiador ácido", "desincrustante"],
    lapicero: ["bolígrafo", "pluma", "esfero", "boli"],
    marcador: ["plumón", "rotulador", "marcadores", "resaltador"],
    resma: ["paquete de papel", "hojas", "papeles"],
    impresora: ["plotter", "máquina de impresión", "impresoras"],
    cartucho: ["tinta", "toner", "recarga", "cartuchos"],
    cable: ["alambre", "conector", "extensión", "cables"],
    cargador: ["alimentador", "cable de carga", "adaptador"],
    audífonos: ["auriculares", "cascos", "headphones", "audífono"],
    mochila: ["bolso", "maletín", "backpack", "mochilas"],
    borrador: ["goma", "corrector", "goma de borrar"],
    teclado: ["keyboard", "teclados", "periférico de escritura"],
    mouse: ["ratón", "dispositivo apuntador", "mouses", "mousepad"],
    memoria: ["usb", "pendrive", "almacenamiento", "memorias"],
    pantalla: ["monitor", "display", "pantallas", "visualizador"],
    cable: ["conector", "alambre", "extensión", "cableado"],
    cámara: ["webcam", "cámara de seguridad", "filmadora"],
    // Agrega más sinónimos aquí
  };

  // Función para normalizar (quitar tildes y pasar a minúsculas)
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Algoritmo de Levenshtein para tolerancia a errores
  const calcularDistancia = (a, b) => {
    const matriz = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) matriz[i][0] = i;
    for (let j = 0; j <= b.length; j++) matriz[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const costo = a[i - 1] === b[j - 1] ? 0 : 1;
        matriz[i][j] = Math.min(
          matriz[i - 1][j] + 1,     // Eliminación
          matriz[i][j - 1] + 1,     // Inserción
          matriz[i - 1][j - 1] + costo  // Sustitución
        );
      }
    }
    return matriz[a.length][b.length];
  };

  // Función de coincidencia tolerante a errores
  const coincideAproximado = (termino, texto) => {
    const distancia = calcularDistancia(termino, texto);
    return distancia <= Math.max(1, Math.floor(termino.length * 0.3));
  };

  // Expande términos con sinónimos
  const expandirTerminos = (termino) => {
    for (const [clave, sinonimosLista] of Object.entries(sinonimos)) {
      if ([clave, ...sinonimosLista].some((sinonimo) => normalizarTexto(sinonimo) === termino)) {
        return [clave, ...sinonimosLista].map(normalizarTexto);
      }
    }
    return [termino];
  };

  // Función de búsqueda mejorada
  const handleSearch = () => {
    const normalizedTerm = normalizarTexto(searchTerm.trim());

    if (normalizedTerm === "") {
      setFilteredProducts(productos);  // Muestra todos si el input está vacío
      return;
    }

    // Expande términos y fragmenta en palabras clave
    const terminosBuscados = expandirTerminos(normalizedTerm).flatMap((termino) =>
      termino.split(" ")
    );

    const filtered = productos.filter((product) => {
      const campos = [
        normalizarTexto(product.name),
        normalizarTexto(product.brand),
        normalizarTexto(product.category),
      ];

      return terminosBuscados.some((termino) =>
        campos.some((campo) =>
          campo.includes(termino) || coincideAproximado(termino, campo)
        )
      );
    });

    setFilteredProducts(filtered);
  };

  // Efectos
  useEffect(() => {
    fetchProductos("Ver Todo");
  }, []);

  

  useEffect(() => {
    const handlePopState = () => {
      setShowBanner(true);
      fetchProductos("Ver Todo");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Funciones
  const fetchProductos = async (category) => {
    let archivos = [];

    if (category === "Ver Todo") {
      archivos = [
        "vertodo.json",
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
            availability: item.disponibilidad,
            destacado: item.destacado || false
          }))
        ];
      }

      setProductos(productosCargados);
      setFilteredProducts(productosCargados);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    fetchProductos(categoryName);
  };

  const handleProductClick = (product) => {
    if (!product || !product.name) {
      console.error("Producto o nombre no válido:", product);
      return;
    }
    // Redirige a la página del producto usando el nombre codificado en la URL
    navigate(`/producto/${encodeURIComponent(product.name)}`);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.classList.remove("modal-open");
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    const sorted = [...productos].sort((a, b) => {
      switch (option) {
        case "precio-asc":
          return a.price - b.price;
        case "precio-desc":
          return b.price - a.price;
        case "nombre-asc":
          return a.name.localeCompare(b.name);
        case "nombre-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0; // Mantener el orden original para "Relevancia"
      }
    });

    setFilteredProducts(sorted);
  };

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <main className="catalog-container">
      {/* Header */}
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
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();  // Ejecuta la búsqueda solo si se presiona Enter
              }
            }}
          />
        </div>
      </header>

      {/* Banner (condicional) */}
      {showBanner && (
        <section className="banner">
          <h2>EXPLORA NUESTRA COLECCIÓN</h2>
          <p>Todo lo que necesitas para tu hogar y oficina en un solo lugar.</p>
        </section>
      )}

      {/* Sidebar de categorías */}
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

      {/* Contenido principal */}
      <section className="catalog-content">
        {/* Filtros y ordenamiento */}
        <div className="filters">
          <div className="sort-dropdown">
            <FaArrowUp className="sort-icon" />
            <select value={sortOption} onChange={handleSortChange} className="sort-select">
              <option value="Random">Relevancia</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre-asc">Nombre: A - Z</option>
              <option value="nombre-desc">Nombre: Z - A</option>
            </select>
          </div>
        </div>

        {/* Modal de producto */}
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

        {/* Grid de productos */}
        <div className="product-grid">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => {
              // Intentar convertir el precio a número eliminando "S/" y comas
              let cleanPrice = product.price?.toString().replace("S/", "").replace(",", "").trim();
              let numericPrice = parseFloat(cleanPrice);

              return (
                <div
                key={product.name} // Usamos el nombre como key
                className="product-card"
                onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="product-img"
                  />
                  <div className="product-info">
        <div className="product-title">{product.name}</div>
        <div className="product-price">
                      {!isNaN(numericPrice)
                        ? numericPrice.toLocaleString("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          })
                        : product.price || "Precio no disponible"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No hay productos en esta categoría.</p>
          )}
        </div>

        {/* Paginación */}
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