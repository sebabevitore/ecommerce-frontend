import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../components/ProductDetail.css'

const API = 'http://localhost:8080'

function ProductDetail() {
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


  if (loading) return <p>Cargando...</p>

  if (!product) {
    return (
      <div className="product-detail-container">
        <h1>Producto no encontrado</h1>
        <Link to="/" className="btn-back">
          Volver a Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <Link to="/" className="btn-back">
        ← Volver a Productos
      </Link>
      <div className="product-detail">
        <div className="product-image">
          {/* <img src={product.imagen || `https://via.placeholder.com/400?text=${product.nombre}`} alt={product.nombre} /> */}
          {/* encodeURIComponent: Esto limpia el texto para que la URL sea válida. */}
          <img
            src={product.imagen || `https://placehold.co/400?text=${encodeURIComponent(product.nombre)}`}
            alt={product.nombre}
            onError={(e) => {
              e.target.onerror = null;
              // Usamos una imagen de stock global que sabemos que siempre funciona
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
            }}
          />

        </div>
        <div className="product-description">
          <h1>{product.nombre}</h1>
          <p className="description">{product.descripcion}</p>
          <p className="price">${product.precio}</p>
          <button className="btn-add-cart">Agregar al Carrito</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
