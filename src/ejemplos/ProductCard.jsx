import React from 'react';
import './ProductCard.css';

const ProductCard = ({nombre,precio,children,image, freeShipping, isPromo}) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image} 
          alt={`${nombre}'s product`}
          className="card__image"
        />
      </div>
      <h3 className="product-title">{nombre}</h3>
      <div className="product-price">${precio}</div>

      {freeShipping && <span className="badge">✈️ Envío Gratis</span>}
      {isPromo && <span className="badge-promo">🔥 Promo</span>}

      <div className="extra">
        {children}
      </div>
  
    </div>

  
  );
};

export default ProductCard;