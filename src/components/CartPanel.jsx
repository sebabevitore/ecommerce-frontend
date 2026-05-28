// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const Carrito = ({ alIrAlLogin }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [totalCarrito, setTotalCarrito] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_URL = 'http://localhost:8080/api/carrito';

//   const fetchCarrito = async (token) => {
//     try {
//       const response = await fetch(API_URL, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.status === 401 || response.status === 403) {
//         localStorage.clear();
//         window.location.href = '/login';
//         return;
//       }

//       if (!response.ok) throw new Error('Error al obtener el carrito');

//       const data = await response.json();
//       setCartItems(data.items);
//       setTotalCarrito(data.total);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('jwt_token');
//     const rol = localStorage.getItem('user_role');

//     if (!token || rol !== 'USER') {
//       setLoading(false);
//       return;
//     }
//     fetchCarrito(token);
//   }, []);

//   const token = localStorage.getItem('jwt_token');
//   const rol = localStorage.getItem('user_role');

//   if (!token || rol !== 'USER') {
//     return (
//       <div className="carrito-container" style={{ textAlign: 'center' }}>
//         <h2>Acceso Restringido 🔒</h2>
//         <p>Necesitas iniciar sesión para ver tu carrito.</p>
//         <Link to="/login" className="btn-checkout">
//           Iniciar Sesión
//         </Link>

//       </div>
//     );
//   }

//   if (loading) return <p>Cargando tu carrito...</p>;
//   if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

//   return (
//     <div className="carrito-container">
//       <h2>Tu Carrito de Compras</h2>
//       {cartItems.length === 0 ? (
//         <p>El carrito está vacío.</p>
//       ) : (
//         <div>
//           <ul className="carrito-lista">
//             {cartItems.map((item) => (
//               <li key={item.id} className="carrito-item">
//                 <span>Producto ID: {item.id_producto}</span>
//                 <span>Cantidad: {item.cantidad}</span>
//                 <span>Precio: ${item.precioUnitario}</span>
//                 <span>Subtotal: ${item.precioUnitario * item.cantidad}</span>
//               </li>
//             ))}
//           </ul>
//           <h3>Total: ${totalCarrito}</h3>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Carrito;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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