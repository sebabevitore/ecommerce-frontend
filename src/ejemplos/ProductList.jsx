import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard.jsx';
import productosData from '../data/products.json';
import './ProductList.css';

const API = 'http://localhost:8080';

const ProductList = () => {

  // 1. Reemplazamos el JSON estático por un estado de React
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Hacemos la llamada real a tu servidor Spring Boot de la UADE
  const fetchCatalog = async () => {
    try {
      const res = await fetch(`${API}/api/productos`); // Endpoint público GET
      if (!res.ok) throw new Error('Error al conectar con el servidor');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCatalog();
  }, []);

  if (loading) return <p className="loading">Cargando catálogo...</p>;
  if (error) return <p className="error">Hubo un problema: {error}</p>;

  return (
    <div className="product-list-container">
      <h2>Catálogo de Productos</h2>
      <div className="product-list">
        {productos.map((producto) => (
          <ProductCard 
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            image={producto.imagen}
            freeShipping={producto.freeShipping}
            isPromo={producto.isPromo}
            hasWarranty={producto.hasWarranty}
          >
            <p className="producto-categoria">
              {producto.categorias ? producto.categorias.join(', ') : 'Sin categoría'}
            </p>
            <p className="producto-descripcion">{producto.descripcion}</p>
            <p className="producto-rating">⭐ {producto.rating}</p>
            <p className="producto-stock">Stock: {producto.stock}</p>
          </ProductCard>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
