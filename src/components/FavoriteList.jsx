// src/components/FavoritesList.jsx
import ProductCard from './ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorite, removeFavorite } from '../store/slices/favoriteSlice'
import "../style/ProductCatalog.css" // Reutilizamos estilos de la grilla


const FavoritesList = () => {
  const favoriteItems = useSelector(state => state.favorite.items)
  const dispatch = useDispatch()

  // Función para formatear el precio (igual que en Catalog)
  const formatearPrecio = (numero) => {
    return Number(numero).toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
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
      </div>
    </div>
  )
}

export default FavoritesList