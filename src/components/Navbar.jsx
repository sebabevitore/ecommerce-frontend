import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchCartItems, clearCart } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  
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
        
        {isAuthenticated ? (
          <>
            <Link to="/admin">
              <i className="fa-solid fa-key"></i> Admin
            </Link>
            
            <Link to="/carrito">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </Link>
            
            <Link to="/favorites">
              <i className="fa-solid fa-heart"></i> Favoritos
            </Link>
            
            <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: '5px' }}></i> 
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <i className="fa-solid fa-circle-user"></i> Iniciar Sesión
            </Link>
            
            <Link to="/register">
              <i className="fa-solid fa-users"></i> Registrarse
            </Link>
          </>
        )}

        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        >
          {theme === 'light' ? (
            <i className="fa-solid fa-moon"></i>
          ) : (
            <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;