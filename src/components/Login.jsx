import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Form.css'

const API = 'http://localhost:8080'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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

      localStorage.setItem('jwt_token', data)
      localStorage.setItem('user_role', 'USER');

      window.location.href = '/';
      // Al usar window.location.href = '/', obligamos 
      // al navegador a recargar la página completa. Esto garantiza que:
      // El Header vuelva a leer el localStorage.
      // Como ahora el token está guardado como jwt_token, 
      // el Header lo encontrará y cambiará mágicamente los
      // botones de "Iniciar Sesión" por los de "Carrito" y "Cerrar Sesión".
      //antes estaba navigate('/')

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="form-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        <p className="form-link">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
