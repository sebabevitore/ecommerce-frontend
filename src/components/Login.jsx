<<<<<<< HEAD
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/slices/authSlice'
=======
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
>>>>>>> main
import '../style/Form.css';

const Login = () => {
<<<<<<< HEAD
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.text()

      if (!res.ok) throw new Error(data || 'Credenciales inválidas')

      dispatch(login(data))

      navigate('/')

    } catch (err) {
      setError(err.message)
=======
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Redirigir cuando el login sea exitoso
  useEffect(() => {
    if (isAuthenticated) {
      setCredentials({ email: '', password: '' });
      navigate('/');
>>>>>>> main
    }
  }, [isAuthenticated, navigate]);

  // Limpiar errores si el componente se desmonta
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
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

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Iniciar Sesión</h2>
        
        {error && <p className="form-error">{error}</p>}
<<<<<<< HEAD

=======
        
>>>>>>> main
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={credentials.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
<<<<<<< HEAD

        <button type="submit">Ingresar</button>

=======
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
        
>>>>>>> main
        <p className="form-link">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </form>
    </div>
  );
}

<<<<<<< HEAD
export default Login
=======
export default Login;
>>>>>>> main
