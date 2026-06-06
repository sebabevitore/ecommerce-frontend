import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../style/ProductDetail.css'
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const API = 'http://localhost:8080'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cantidad, setCantidad] = useState(1);

const dispatch = useDispatch();

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

  const handleAddToCart = () => {
    dispatch(addToCart({ producto: product, cantidad: cantidad }));
  };

  return (
    <div className="product-detail-container">
      <Link to="/" className="btn-back">
        ← Volver a Productos
      </Link>
      <div className="product-detail">
        <div className="product-image">
          <img src={product.imagenUrl || `https://via.placeholder.com/400?text=${product.nombre}`} alt={product.nombre} />
        </div>
        <div className="product-description">
          <h1>{product.nombre}</h1>
          <p className="description">{product.descripcion}</p>
          <p className="price">${product.precio}</p>
          
          {/* NUEVO: Controles de cantidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontWeight: 'bold' }}>Cantidad:</span>
            <button 
              onClick={() => setCantidad(c => Math.max(1, c - 1))}
              style={{ padding: '5px 15px', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              -
            </button>
            <span style={{ fontSize: '1.2rem', minWidth: '30px', textAlign: 'center' }}>
              {cantidad}
            </span>
            <button 
              onClick={() => setCantidad(c => c + 1)}
              style={{ padding: '5px 15px', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              +
            </button>
          </div>
          
          {/* pasamos la cantidad seleccionada */}
          <button 
            className="btn-add-to-cart" 
            onClick={handleAddToCart} 
            style={{
              backgroundColor: '#2D3277', color: 'white', padding: '1rem',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
              width: '100%', fontSize: '1.1rem', fontWeight: 'bold'
            }}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
