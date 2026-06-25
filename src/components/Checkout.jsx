import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';

//FALTA VALIDAR STOCK Y CREAR PEDIDO EN BD

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Traemos los items del carrito desde Redux
  const cartItems = useSelector(state => state.cart.items);

  // total a pagar
  const totalCompra = cartItems.reduce((total, item) => {
    return total + (item.precioUnitario * (item.cantidad || 1));
  }, 0);

  const handleConfirmarCompra = () => {
    // FALTA DESCONTAR STOCK Y CREAR PEDIDO EN BD

    alert('¡Compra confirmada con éxito! 🎉');
    
    // Vaciamos el carrito
    dispatch(clearCart());
    
    // Redirigimos al usuario a la página principal
    navigate('/');
  };

  //si carrito vacio
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No tienes productos para comprar</h2>
        <Link to="/">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2D3277', marginBottom: '2rem' }}>
        Resumen de tu Compra
      </h1>
      
      {/* TARJETA DE RESUMEN */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        
        {/* LISTA DE PRODUCTOS */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {cartItems.map(item => (
            <li 
              key={item.id} 
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}
            >
              <span>
                <strong style={{ color: '#2D3277' }}>{item.quantity}x</strong> {item.nombre}
              </span>
              <span style={{ fontWeight: 'bold' }}>
                {item.cantidad}x {item.nombreProducto}
                ${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
              </span>
            </li>
          ))}
        </ul>
        
        {/* TOTAL */}
        <h2 style={{ textAlign: 'right', marginTop: '2rem', color: '#2D3277', borderTop: '2px solid #ccc', paddingTop: '1rem' }}>
          Total a pagar: ${totalCompra.toLocaleString('es-AR')}
        </h2>

        {/* BOTONERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Link 
            to="/carrito" 
            style={{
              padding: '0.8rem 1.5rem',
              textDecoration: 'none',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            ← Volver al carrito
          </Link>
          
          <button
            onClick={handleConfirmarCompra}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '0.8rem 2rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Confirmar Compra
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;