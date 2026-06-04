
import { Link } from 'react-router-dom'
import '../style/ProductCard.css';
import {useFavorite} from '../hooks/context/FavoriteProvider.jsx'
import { useCart } from '../hooks/useContext/CartContext.jsx';

const ProductCard = ({producto, precioFormateado}) => {
  const { favoriteItems, addToFavorites } = useFavorite()
  const { addToCart } = useCart();

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
          src={producto.imagenUrl || producto.imagen} 
          alt={`${producto.nombre}'s product`}
          className="card__image"
        />
      </div>
      
      <h3 className="product-title">{producto.nombre}</h3>
      <div className="product-price">${precioFormateado}</div>

      {/* Etiquetas condicionales */}
      {producto.freeShipping && <span className="badge">✈️ Envío Gratis</span>}
      {producto.promo && <span className="badge-promo">🔥 Promo</span>}

      {/* BOTÓN DE FAVORITOS */}
      <button 
        className={`btn-favorite ${isFavorite ? 'active' : ''}`}
        onClick={handleAddToFavorite}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: isFavorite ? 'red' : 'gray' }}
      >
        <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
      </button>

      {/* ENLACE PARA VER DETALLES */}
      <Link 
        to={`/products/${producto.id}`} 
        className="btn-details" 
        style={{ display: 'block', marginTop: '10px', textAlign: 'center', textDecoration: 'none', color: '#2D3277', fontWeight: 'bold' }}
      >
        Ver Detalles
      </Link>

      <button 
        className="btn-add-to-cart" 
        onClick={() => addToCart(producto, 1)} // Agrega 1 unidad por defecto
        style={{
          backgroundColor: '#2D3277',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
          width: '100%'
        }}
      >
        Agregar al Carrito
      </button>
    </div>
  );
};

export default ProductCard;
