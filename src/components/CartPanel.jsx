import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './CartPanel.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8080/api/carrito';
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCarrito();
  }, [token]);

  const fetchCarrito = async () => {
    try {
      const res = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` }});
      if (res.status === 401) { localStorage.clear(); window.location.href = '/login'; }
      const data = await res.json();
      setCartItems(data.items);
      setTotalCarrito(data.total);
    } catch (err) { setError("Error al cargar carrito"); }
    finally { setLoading(false); }
  };

  // Eliminar
  const eliminarItem = async (itemId) => {
    const res = await fetch(`${API_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchCarrito(); // Recargamos para ver cambios
  };

  // Checkout
const realizarCheckout = async () => {
  try {
    const res = await fetch(`${API_URL}/checkout`, { 
      method: 'POST', 
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      alert("¡Compra exitosa! Stock descontado.");
      setCartItems([]);
      setTotalCarrito(0);
    } else {
      // validar stock
      const errorMsg = await res.text();
      alert("Error en la compra: " + errorMsg); // Ej: "Stock insuficiente para Producto X"
    }
  } catch (err) {
    alert("Error de conexión con el servidor");
  }
};

  if (loading) return <p>Cargando...</p>;
  if (!token) return (
    <div style={{textAlign: 'center'}}>
      <h2>Acceso Restringido 🔒</h2>
      <Link to="/login">Iniciar Sesión</Link>
    </div>
  );

  return (
    <div className="carrito-container">
      <h2>Tu Carrito</h2>
      {cartItems.map(item => (
        <li key={item.id}>
          ID: {item.id_producto} | Cant: {item.cantidad} | ${item.precioUnitario}
          <button onClick={() => eliminarItem(item.id)}>Eliminar</button>
        </li>
      ))}
      <h3>Total: ${totalCarrito}</h3>
      <button onClick={realizarCheckout}>Finalizar Compra</button>
    </div>
  );
};

export default Carrito;