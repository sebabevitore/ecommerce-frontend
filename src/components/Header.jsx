import { Link, useNavigate } from 'react-router-dom';
//import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  // Verificamos si existe el token en cualquier momento que el header se renderice
  const token = localStorage.getItem('jwt_token');

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    // Forzamos recarga para limpiar memoria y volver al estado inicial
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">E-commerce-UADE</Link>
      <div className="nav-links">
        <Link to="/">Inicio</Link>
        
        {/* Renderizado condicional basado puramente en la existencia del token */}
        {token ? (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/cart">Carrito</Link>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;