import { useState, useEffect } from 'react'
import './AdminProducts.css'

const API = 'http://localhost:8080'

const AdminProducts = () => {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '', stock: '', image: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = () => localStorage.getItem('token')

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token()}`
  })

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`, { headers: headers() })
      const data = await res.json()
      setProductos(Array.isArray(data) ? data : data.products || [])
    } catch (err) {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({ name: '', price: '', category: '', description: '', stock: '', image: '' })
    setEditing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const method = editing ? 'PUT' : 'POST'
    const url = editing
      ? `${API}/api/products/${editing.id}`
      : `${API}/api/products`

    try {
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
      })
      if (!res.ok) throw new Error('Error al guardar producto')
      resetForm()
      fetchProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (producto) => {
    setForm({
      name: producto.name,
      price: producto.price,
      category: producto.category,
      description: producto.description,
      stock: producto.stock,
      image: producto.image || ''
    })
    setEditing(producto)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: 'DELETE',
        headers: headers()
      })
      if (!res.ok) throw new Error('Error al eliminar producto')
      fetchProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="loading">Cargando...</p>

  return (
    <div className="admin-container">
      <h2>Gestión de Productos</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Precio" type="number" step="0.01" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Categoría" value={form.category} onChange={handleChange} required />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required />
        <input name="image" placeholder="URL de imagen" value={form.image} onChange={handleChange} />
        <div className="form-actions">
          <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
          {editing && <button type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div className="admin-table">
        <h3>Productos ({productos.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && <p className="empty">No hay productos</p>}
      </div>
    </div>
  )
}

export default AdminProducts
