import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch, useEffect } from 'react-redux';
import { 
  removeCartItemAsync, 
  updateQuantityAsync, 
  clearCartAsync, 
  fetchCartItems 
} from '../store/slices/cartSlice';
import defaultImage from '../assets/imgXdefault.jpg';

const Carrito = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const loading = useSelector(state => state.cart.loading); 
  const error = useSelector(state => state.cart.error);

  const handleRemoveFromCart = (id) => {
    dispatch(removeCartItemAsync(id));
  };

  const handleUpdateQuantity = (id, cantidad) => {
    dispatch(updateQuantityAsync({ id: id, cantidad: cantidad })); 
  };

  const handleClearCart = () => {
    dispatch(clearCartAsync());
  // .reduce() recorre todos los items, multiplica precio * cantidad, y lo va sumando al 'total'
  const totalCompra = cartItems.reduce((total, item) => {
    return total + (item.precio * (item.quantity || 1));
  }, 0);

  useEffect(() => {
    dispatch(fetchCartItems());
    // dispatch esta en el array de dependencias para evitar warnings de React, aunque en este caso no es necesario porque dispatch no cambia, pero es una buena práctica incluirlo.
  }, [dispatch]);

  //const total = calculateTotal();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Carrito de Compras</h1>
      
      {cartItems.length > 0 && (
        <p>Tienes {cartItems.length} productos en el carrito</p>
      )}

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            {cartItems.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #eee'
                }}
              >
                <img
                  src={item.imagenUrl || item.imagen || defaultImage}
                  alt={item.nombre}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.nombre}</h3>

                  {/* botones para sumar y restar cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '10px 0' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)} 
                      style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      -
                    </button>

                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)} 
                      style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      +
                    </button>
                  </div>

                  <p style={{ margin: '0.5rem 0', color: '#2D3277', fontWeight: 'bold' }}>
                    Subtotal: ${(item.precio * (item.quantity || 1)).toLocaleString('es-AR')}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemoveFromCart(item.id)} 
                  style={{
                    padding: '0.5rem', background: 'none', border: '1px solid #ff4444',
                    color: '#ff4444', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div style={{
        backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '8px',
        marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'
      }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>
          Total a Pagar: <span style={{ color: '#2D3277' }}>${totalCompra.toLocaleString('es-AR')}</span>
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={handleClearCart} 
            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer' }}
          >
            Vaciar Carrito  
          </button>
          <Link to="/" style={{ backgroundColor: '#ccc', color: '#333', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
            Seguir comprando
          </Link>
          <Link to="/checkout" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '0.5rem 2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold' }}>
            Pagar
          </Link>
        </div>
      </div>
    </div>
  );
};
}
export default Carrito; 