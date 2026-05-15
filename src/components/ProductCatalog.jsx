import { useState, useEffect } from 'react'
import ProductCard from '../ejemplos/ProductCard'
import './ProductCatalog.css'

const API = 'http://localhost:8080'

const ProductCatalog = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos')
        return res.json()
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : data.products || []
        setProductos(lista)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="loading">Cargando productos...</p>
  if (error) return <p className="error">Error: {error}</p>

  return (
    <div className="catalog-container">
      <h2>Catálogo de Productos</h2>
      {productos.length === 0 && <p>No hay productos disponibles.</p>}
      <div className="product-grid">
        {productos.map(producto => (
          <ProductCard
            key={producto.id}
            nombre={producto.name}
            precio={producto.price}
            image={producto.image}
            freeShipping={producto.freeShipping}
            isPromo={producto.isPromo}
          >
            <p className="producto-categoria">{producto.category}</p>
            <p className="producto-descripcion">{producto.description}</p>
            <p className="producto-stock">Stock: {producto.stock}</p>
          </ProductCard>
        ))}
      </div>
    </div>
  )
}

export default ProductCatalog
