import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, setSelectedCategory } from '../store/slices/productosSlice';
import { fetchCategoriesAsync } from '../store/slices/categoriaSlice';
import ProductCard from './ProductCard';
import CategoryList from './CategoryList';
import "../style/ProductCatalog.css";
import Spinner from './Spinner';


const ProductCatalog = () => {
  const dispatch = useDispatch();
  
  const { 
    items: productos, 
    loading: prodLoading, 
    error: prodError, 
    selectedCategory 
  } = useSelector(state => state.products);

  const { 
    items: categorias, 
    loading: catLoading, 
    error: catError 
  } = useSelector(state => state.categories);

  useEffect(() => { 
    dispatch(fetchProductsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handleCategorySelect = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const formatearPrecio = (numero) => {
    if (numero === undefined || numero === null) return '0';
    return Number(numero).toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  // Filtrado
  const categoriaEncontrada = selectedCategory 
    ? categorias.find(cat => cat.id === selectedCategory || cat.id_categoria === selectedCategory) 
    : null;

  const productosFiltrados = categoriaEncontrada
    ? productos.filter(producto => {
        return producto.categorias && producto.categorias.includes(categoriaEncontrada.nombre);
      })
    : productos;

  // Manejo de carga de cualquiera de los dos
  if (prodLoading || catLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Spinner className="loading">Cargando catálogo...</Spinner>
      </div>
    );
  }

  // Manejo de error de cualquiera de los dos
  if (prodError || catError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="error" style={{ color: '#ff4444' }}>Error: {prodError || catError}</p>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <h2>Catálogo de Productos</h2>
      <div className="catalog-layout">
        <CategoryList 
          categories={categorias} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory} 
        />

        <div className="catalog-main">
          <div className="product-grid">
            {productosFiltrados.length === 0 && <p>No hay productos disponibles para esta categoría.</p>}
            {productosFiltrados.map(producto => (
              <ProductCard
                key={producto.id} 
                producto={producto}
                precioFormateado={formatearPrecio(producto.precio)}>
              </ProductCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog;