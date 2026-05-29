import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './UserOrders.css'

const API = 'http://localhost:8080'

const UserOrders = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!token) {
        setError('Tenés que iniciar sesión para ver tus pedidos.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API}/api/pedidos/mis-pedidos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error('No se pudieron cargar los pedidos.')
        }

        const data = await res.json()
        setPedidos(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [token])

  if (loading) {
    return <p className="loading">Cargando pedidos...</p>
  }

  if (error) {
    return (
      <div className="orders-container">
        <h2>Mis pedidos</h2>
        <p className="error">{error}</p>
        <Link to="/login" className="orders-link">
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <h2>Mis pedidos</h2>

      {pedidos.length === 0 ? (
        <p className="empty-orders">Todavía no tenés pedidos realizados.</p>
      ) : (
        <div className="orders-list">
          {pedidos.map((pedido) => (
            <div className="order-card" key={pedido.id}>
              <h3>Pedido #{pedido.id}</h3>

              <p>
                <strong>Fecha:</strong> {pedido.fecha || 'Sin fecha'}
              </p>

              <p>
                <strong>Estado:</strong> {pedido.estado || 'Sin estado'}
              </p>

              <p>
                <strong>Total:</strong> ${pedido.total || 0}
              </p>

              {pedido.items && pedido.items.length > 0 && (
                <div className="order-items">
                  <strong>Productos:</strong>
                  <ul>
                    {pedido.items.map((item, index) => (
                      <li key={index}>
                        {item.nombreProducto || item.nombre || 'Producto'} - Cantidad:{' '}
                        {item.cantidad || 1}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserOrders