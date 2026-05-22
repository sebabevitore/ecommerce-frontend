import { useState, useEffect} from 'react'
import ProductCard from '../ejemplos/ProductCard'
import './ProductCatalog.css'

const API = 'http://localhost:8080'

const ProductCatalog = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/productos`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos')
        return res.json()
      })
      .then(data => {
        setProductos(Array.isArray(data) ? data : []);
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="loading">Cargando productos...</p>
  if (error) return <p className="error">Error: {error}</p>
  
  const formatearPrecio = (numero) => {
    if (numero === undefined || numero === null) return '0';
  
    // Usa el formateador oficial de Argentina sobre el número real que viene de la BD
    return Number(numero).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
    });
  }

  return (
    <div className="catalog-container">
      <h2>Catálogo de Productos</h2>
      {productos.length === 0 && <p>No hay productos disponibles.</p>}
      <div className="product-grid">
        {productos.map(producto => (
          <ProductCard
            key={producto.id} 
            nombre={producto.nombre}
            precio={formatearPrecio(producto.precio)}
            imagen={producto.imagenUrl}
            id={producto.id}
            freeShipping={producto.freeShipping}
            isPromo={producto.isPromo}>
          </ProductCard>
          
        ))}
      </div>

    </div>
  )
}

export default ProductCatalog
