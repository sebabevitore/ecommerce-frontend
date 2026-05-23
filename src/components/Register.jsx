import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../style/Form.css'

const API = 'http://localhost:8080'

const Register = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido: '', email, password })
      })

      // Primero leemos la respuesta como TEXTO para evitar que rompa el JSON
      const data = await res.text()


      if (!res.ok) {
        // Si el backend tiró error (ej: EmailException), mostramos ese texto
       throw new Error(data || 'Error al registrarse')
      }

      // Si todo salió bien:
      alert(data) // Va a mostrar el cartel de "Usuario registrado exitosamente"
    
      // Como tu backend de registro NO genera token (solo lo hace el login),
      // mandamos al usuario a la pantalla de login para que inicie sesión.
      navigate('/login')
    
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Registrarse</h2>
        {error && <p className="form-error">{error}</p>}
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Crear cuenta</button>
        <p className="form-link">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
