import React, { useEffect } from 'react';
import ProductCard from './ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { removeFavoriteAsync, fetchFavoriteItems, clearFavoritesAsync } from '../store/slices/favoriteSlice'
import "../style/ProductCatalog.css" // Reutilizamos estilos de la grilla


const FavoritesList = () => {
  const dispatch = useDispatch()
  const favoriteItems = useSelector(state => state.favorite.items)
  const loading = useSelector((state) => state.favorite.loading);
  const error = useSelector((state) => state.favorite.error);

  // Al montar el componente, se dispara la acción asincrónica para obtener los items del favoritos
  // dispatch(fetchFavoriteItems()) envía la acción fetchFavoriteItems a Redux, que a su vez ejecuta la función asincrónica definida en createAsyncThunk 
  // para obtener los items del favoritos desde la API.
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

  // Usar el remove de la api
  const handleRemoveFromFavorite = (productId) => {
    dispatch(removeFavoriteAsync(productId));
  };

  // Usar el clear de la api
  const handleClearFavorites = () => {
    dispatch(clearFavoritesAsync());
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
      <div className="favorites-header">
        <h2>Mis favoritos</h2>
        {favoriteItems.length > 0 && (
          <button onClick={handleClearFavorites} className="clear-favorites-btn">
            <i className="fa-solid fa-trash-can"></i> Limpiar favoritos
          </button>
        )}
      </div>

      {favoriteItems.length === 0 ? (
        <div className="empty-favorites-container">
          <i className="fa-regular fa-heart empty-heart-icon"></i>
          <h3>Aún no tenés productos favoritos</h3>
        </div>
      ) : (
        <div className="product-grid">
          {favoriteItems.map(producto => (
            <ProductCard
              key={producto.id}
              producto={producto}
              precioFormateado={formatearPrecio(producto.precio)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesList