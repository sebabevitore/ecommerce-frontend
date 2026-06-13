import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { fetchCartItems, clearCart } from '../store/slices/cartSlice';
//import './Navbarr.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [token, setToken] = useState(localStorage.getItem('token')); 
// Cada vez que cambies de ruta o se recargue la página, el Navbar verifica la sesión
  useEffect(() => {
    const tokenActual = localStorage.getItem('token');
    setToken(tokenActual); 

    // 💡 SI EL USUARIO ESTÁ LOGUEADO: Traemos su carrito del backend de forma inmediata
    if (tokenActual) {
      dispatch(fetchCartItems());
    }
  }, [location, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setToken(null); 
    
    // 💡 LIMPIEZA: Borramos el carrito de la memoria de Redux para que no quede el del usuario anterior
    dispatch(clearCart()); 
    
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">E-commerce-UADE</Link>
      <div className="nav-links">
        
        {/* INICIO: Siempre visible */}
        <Link to="/">
          <i className="fa-solid fa-house" style={{ color: 'rgb(26, 26, 26)' }}></i> Inicio
        </Link>
        
        {/* RENDERIZADO CONDICIONAL */}
        {token ? (
          <>
            {/* Vistas protegidas para usuarios logueados */}
            <Link to="/admin">
              <i className="fa-solid fa-key" style={{ color: 'rgb(26, 26, 26)' }}></i> Admin
            </Link>
            
            <Link to="/carrito">
              <i className="fa-solid fa-cart-shopping" style={{ color: 'rgb(26, 26, 26)' }}></i> Carrito
            </Link>
            
            <Link to="/favorites">
              <i className="fa-solid fa-heart" style={{ color: 'rgb(26, 26, 26)' }}></i> Favoritos
            </Link>
            
            <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: 'rgb(26, 26, 26)', marginRight: '5px' }}></i> 
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* Vistas para visitas o usuarios no logueados */}
            <Link to="/login">
              <i className="fa-solid fa-circle-user" style={{ color: 'rgb(26, 26, 26)' }}></i> Iniciar Sesión
            </Link>
            
            <Link to="/register">
              <i className="fa-solid fa-users" style={{ color: 'rgb(26, 26, 26)' }}></i> Registrarse
            </Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;