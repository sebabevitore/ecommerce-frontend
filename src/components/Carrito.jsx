import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API = 'http://localhost:8080'

function Carrito() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  return (
    <div className="carrito-container">
      <h1>Tu Carrito</h1>
      <div className="carrito-content">
        <p>Carrito vacío</p>
        <Link to="/" className="btn-back">
          ← Volver a Productos
        </Link>
      </div>
    </div>
  )
}

export default Carrito