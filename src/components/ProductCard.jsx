
import { Link } from 'react-router-dom'
import '../style/ProductCard.css';
import {useFavorite} from '../hooks/context/FavoriteProvider.jsx'

const ProductCard = ({producto, precioFormateado}) => {
  const { favoriteItems, addToFavorites } = useFavorite()

  const isFavorite = favoriteItems.some(item => item.id === producto.id)

  const handleAddToFavorite = () => {
    // Si ya es favorito, no hacemos nada por ahora (o podrías implementar remove)
    if (!isFavorite) {
      addToFavorites(producto)
    }
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={producto.imagenUrl} 
          alt={`${producto.nombre}'s product`}
          className="card__image"
        />
      </div>
      <h3 className="product-title">{producto.nombre}</h3>
      <div className="product-price">${precioFormateado}</div>

      {producto.freeShipping && <span className="badge">✈️ Envío Gratis</span>}
      {producto.promo && <span className="badge-promo">🔥 Promo</span>}
      
      <button 
        className={`btn-favorite ${isFavorite ? 'active' : ''}`}
        onClick={handleAddToFavorite}
      >
        <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
      </button>
    

      <Link to={`/products/${producto.id}`} className="btn-details">
                Ver Detalles
      </Link>

  
    </div>
  );
};

export default ProductCard;