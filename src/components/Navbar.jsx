import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchCartItems, clearCart } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Escuchamos el estado global en lugar del localStorage
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    // Despachamos las acciones de Redux
    dispatch(logout()); 
    dispatch(clearCart()); 
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">E-commerce-UADE</Link>
      <div className="nav-links">
        
        <Link to="/">
          <i className="fa-solid fa-house" style={{ color: 'rgb(26, 26, 26)' }}></i> Inicio
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/admin">
              <i className="fa-solid fa-key" style={{ color: 'rgb(26, 26, 26)' }}></i> Admin
            </Link>
            
            <Link to="/carrito">
              <i className="fa-solid fa-cart-shopping" style={{ color: 'rgb(26, 26, 26)' }}></i> Carrito
            </Link>
            
            <Link to="/favorites">
              <i className="fa-solid fa-heart" style={{ color: 'rgb(26, 26, 26)' }}></i> Favoritos
            </Link>
            
            <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: 'rgb(26, 26, 26)', marginRight: '5px' }}></i> 
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
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