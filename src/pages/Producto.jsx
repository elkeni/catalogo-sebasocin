import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/producto.css";

const Producto = () => {
  const { nombre } = useParams(); // Obtén el nombre del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista de archivos JSON (verifica que coincidan con los que tengas en /public)
  const archivosJSON = [
    "arte-y-diseno.json",
    "cuidado-personal-limpieza.json",
    "Destacados.json",
    "electrohogar.json",
    "escolar.json",
    "mas-vendidos.json",
    "mascotas.json",
    "oficina.json",
    "outdoors-deporte.json",
    "tecnologia.json",
    "universitario.json",
    "vertodo.json",
  ];

  // Función para cargar todos los productos desde los archivos JSON
  const cargarProductos = async () => {
    try {
      const productos = [];
      for (const archivo of archivosJSON) {
        const response = await fetch(`/${archivo}`);
        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: No se pudo cargar ${archivo}`
          );
        }
        const data = await response.json();
        productos.push(...data);
      }
      return productos;
    } catch (error) {
      setError(error.message);
      return [];
    }
  };

  useEffect(() => {
    const buscarProducto = async () => {
      try {
        const productos = await cargarProductos();
        
        // Decodifica el nombre (en caso de que venga con %20, etc.)
        const nombreBuscado = decodeURIComponent(nombre);

        // Compara ignorando mayúsculas/minúsculas
        const productoEncontrado = productos.find(
          (p) => p.nombre.toLowerCase() === nombreBuscado.toLowerCase()
        );

        if (productoEncontrado) {
          setProducto(productoEncontrado);
        } else {
          setError("Producto no encontrado");
        }
      } catch (err) {
        setError(`Error al buscar el producto: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    buscarProducto();
  }, [nombre]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!producto) return <div className="error">Producto no encontrado</div>;

  return (
    <div className="producto-detalle">
      <div className="producto-content">
        {/* Imagen del producto */}
        <div className="producto-imagen">
          <img src={producto.imagenURL} alt={producto.nombre} />
        </div>

        {/* Información del producto */}
        <div className="producto-info">
          <h1>{producto.nombre}</h1>
          <p className="precio">Precio: {producto.precio}</p>
          <p className="marca">Marca: {producto.marca}</p>
          {/* Características */}
          <div className="caracteristicas">
            <h2>Características</h2>
            <ul>
              {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                producto.caracteristicas.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))
              ) : (
                <li>No hay características disponibles.</li>
              )}
            </ul>
          </div>

          {/* Disponibilidad */}
          <p className="disponibilidad">
            Disponibilidad:{" "}
            <span
              className={
                producto.disponibilidad === "En stock"
                  ? "disponible"
                  : "agotado"
              }
            >
              {producto.disponibilidad}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Producto;
