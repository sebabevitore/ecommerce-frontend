import React, { useEffect } from 'react';
import ProductCard from './ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { removeFavorite, fetchFavoriteItems, clearFavorites } from '../store/slices/favoriteSlice'
import "../style/ProductCatalog.css" // Reutilizamos estilos de la grilla


const FavoritesList = () => {
  const dispatch = useDispatch()
  const favoriteItems = useSelector(state => state.favorite.items)
  const loading = useSelector((state) => state.favorite.loading);
  const error = useSelector((state) => state.favorite.error);

  // Al montar el componente, se dispara la acción asincrónica para obtener los items del carrito
  // dispatch(fetchFavoriteItems()) envía la acción fetchFavoriteItems a Redux, que a su vez ejecuta la función asincrónica definida en createAsyncThunk 
  // para obtener los items del carrito desde la API.
  useEffect(() => {
    dispatch(fetchFavoriteItems());
    // dispatch esta en el array de dependencias para evitar warnings de React, aunque en este caso no es necesario porque dispatch no cambia, pero es una buena práctica incluirlo.
  }, [dispatch]);

  // Función para formatear el precio (igual que en Catalog)
  const formatearPrecio = (numero) => {
    return Number(numero).toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  //TODO: ssanchez - llamar a la api de cartSlice
  const handleRemoveFromFavorite = (productId) => {
    // dispara el reducer internto
    dispatch(removeFavorite(productId));
  };

  //TODO: ssanchez - llamar a la api de cartSlice
  const handleClearFavorites = () => {
    // dispara reducer internto
    dispatch(clearFavorites());
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando favoritos...</p>
      </div>
    );
  }
    // Mostrar error si existe
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ff4444' }}>Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="catalog-container">
      <h2>Mis favoritos</h2>
      <div className="product-grid">
        {favoriteItems.length === 0 ? (
          <p>Aún no tienes productos favoritos.</p>
        ) : (
          favoriteItems.map(producto => (
            <ProductCard
              key={producto.id}
              producto={producto}
              precioFormateado={formatearPrecio(producto.precio)}
            />
          ))
        )}
      <button onClick={handleClearFavorites} className="clear-favorites-button">Limpiar favoritos</button>
      </div>
    </div>
  )
}

export default FavoritesList