import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../style/Form.css'

const API = 'http://localhost:8080'

const Register = () => {
  // 1. Agregamos los nuevos estados
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [sexo, setSexo] = useState('')
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
        // 2. Sumamos los nuevos campos al JSON
        body: JSON.stringify({ 
          nombre: nombre, 
          apellido: apellido, 
          email: email, 
          password: password,
          fecha_nacimiento: fechaNacimiento, // Enviamos con el guion bajo como pide tu BD
          sexo: sexo 
        })
      })

      const data = await res.text()

      if (!res.ok) {
        throw new Error(data || 'Error al registrarse')
      }

      alert(data) 
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
        
        {/* 3. Agregamos los inputs en el HTML */}
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Input especial para fechas */}
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={fechaNacimiento}
          onChange={e => setFechaNacimiento(e.target.value)}
          required
          title="Fecha de nacimiento"
        />

        {/* Selector para el sexo */}
        <select 
          value={sexo} 
          onChange={e => setSexo(e.target.value)} 
          required
        >
          <option value="" disabled>Seleccione sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="X">Otro</option>
        </select>

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