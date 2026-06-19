import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, fetchCartItems, updateQuantity } from '../store/slices/cartSlice';
import { styles } from '../style/CartRedux.styles.js';
import defaultImage from '../assets/imgXdefault.jpg';

// hace exactamente lo mismo que Cart.jsx pero usando Redux en lugar de useContext para manejar el estado del carrito
const Carrito = () => {
  const dispatch = useDispatch();
  
  // Obtener items, loading y error del estado global
  // se suscribe a cambios en state.cart.items, cada vez que se modifica el estado del carrito (agregar, eliminar, limpiar), 
  // el componente CartRedux se re renderiza automáticamente con el nuevo estado del carrito
  const cartItems = useSelector((state) => state.cart.items);
  // se suscribe a cambios en state.cart.loading y error, cada vez que se modifica el estado de carga del carrito (al obtener los items desde la API),
  //  el componente CartRedux se re renderiza automáticamente con el nuevo estado de carga, mostrando el mensaje de "Cargando carrito..." mientras se obtienen los items desde la API
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  const totalCompra = useSelector(state => state.cart.total) || 0;

  // Al montar el componente, se dispara la acción asincrónica para obtener los items del carrito
  // dispatch(fetchCartItems()) envía la acción fetchCartItems a Redux, que a su vez ejecuta la función asincrónica definida en createAsyncThunk 
  // para obtener los items del carrito desde la API.
  useEffect(() => {
    dispatch(fetchCartItems());
    // dispatch esta en el array de dependencias para evitar warnings de React, aunque en este caso no es necesario porque dispatch no cambia, pero es una buena práctica incluirlo.
  }, [dispatch]);


  //TODO: ssanchez - llamar a la api de cartSlice
  const handleRemoveFromCart = (productId) => {
    // dispara el reducer internto
    dispatch(removeFromCart(productId));
  };

  //TODO: ssanchez - llamar a la api de cartSlice
  const handleClearCart = () => {
    // dispara reducer internto
    dispatch(clearCart());
  };

  const handleUpdateQuantity = (item, operacion) => {
    // Calculamos cómo quedaría la cantidad
    const nuevaCantidad = item.cantidad + operacion;
    
    if (nuevaCantidad > 0) {
      dispatch(updateQuantity({ 
        itemId: item.id, 
        cantidad: nuevaCantidad, 
        productoId: item.id_producto 
      })); 
    } else {
      // si llega a 0, eliminamos el producto del carrito
      dispatch(removeFromCart(item.id));
    }
  };

  // cuando se ejecuta handleRemoveFromCart o handleClearCart, el estado del carrito se actualiza en el store global de Redux.
  // Esto hace que el componente CartRedux se vuelva a renderizar automáticamente con el nuevo estado del carrito, mostrando los cambios en la interfaz de usuario.
  //const total = calculateTotal();

  // Mostrar estado de carga
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando carrito...</p>
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
                  // Propiedad "imagen" (del Backend)
                  src={item.imagen || defaultImage}
                  alt={item.nombreProducto}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  {/* Propiedad "nombreProducto" (del Backend) */}
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.nombreProducto}</h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '10px 0' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item, -1)} 
                      style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      -
                    </button>

                    {/* Propiedad "cantidad" (del Backend) */}
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {item.cantidad}
                    </span>

                    <button
                      onClick={() => handleUpdateQuantity(item, 1)} 
                      style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      +
                    </button>
                  </div>

                  <p style={{ margin: '0.5rem 0', color: '#2D3277', fontWeight: 'bold' }}>
                    {/* Propiedades "precioUnitario" y "cantidad" (del Backend) */}
                    Subtotal: ${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
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

export default Carrito;
