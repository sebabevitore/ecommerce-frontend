import React from 'react';
import ProductCard from './ProductCard.jsx';
import productosData from '../data/products.json';
import './ProductList.css';

const ProductList = () => {
  return (
    <div className="product-list-container">
      <h2>Catálogo de Productos</h2>
      <div className="product-list">
        {productosData.products.map((producto) => (
          <ProductCard 
            key={producto.id}
            nombre={producto.name}
            precio={producto.price}
            image={producto.image}
            freeShipping={producto.freeShipping}
            isPromo={producto.isPromo}
            hasWarranty={producto.hasWarranty}
          >
            <p className="producto-categoria">{producto.category}</p>
            <p className="producto-descripcion">{producto.description}</p>
            <p className="producto-rating">⭐ {producto.rating}</p>
            <p className="producto-stock">Stock: {producto.stock}</p>
          </ProductCard>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
