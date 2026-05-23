
import { Link } from 'react-router-dom'
import '../style/ProductCard.css';

const ProductCard = ({id, nombre, precio, children, imagen, freeShipping, isPromo}) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={imagen} 
          alt={`${nombre}'s product`}
          className="card__image"
        />
      </div>
      <h3 className="product-title">{nombre}</h3>
      <div className="product-price">${precio}</div>

      {freeShipping && <span className="badge">✈️ Envío Gratis</span>}
      {isPromo && <span className="badge-promo">🔥 Promo</span>}

      <Link to={`/products/${id}`} className="btn-details">
                Ver Detalles
      </Link>

      <div className="extra">
        {children}
      </div>
  
    </div>

  
  );
};

export default ProductCard;