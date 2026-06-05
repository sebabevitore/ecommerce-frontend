
import '../style/ProductCard.css';
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorite, removeFavorite } from '../store/slices/favoriteSlice'
import { Link } from 'react-router-dom'

const ProductCard = ({producto, precioFormateado}) => {
  const dispatch = useDispatch()
  const favoriteItems = useSelector(state => state.favorite.items)

  const isFavorite = favoriteItems.some(item => item.id === producto.id)

  const handleAddToFavorite = () => {
    if (!isFavorite) {
      dispatch(addToFavorite(producto))
    }
    else {
      dispatch(removeFavorite(producto.id))
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