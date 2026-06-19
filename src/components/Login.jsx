import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import '../style/Form.css'; 

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtenemos el estado desde tu nuevo authSlice
  const { isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Limpiar posibles errores si el usuario cambia de página y vuelve
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  // Redirigir al inicio cuando isAuthenticated cambie a true
  useEffect(() => {
    if (isAuthenticated) {
      setCredentials({ email: '', password: '' });
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Iniciar Sesión</h2>
        
        {/* Mostramos el error que viene de Redux */}
        {error && <p className="form-error">{error}</p>}
        
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Contraseña"
          value={credentials.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
        
        <p className="form-link">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;