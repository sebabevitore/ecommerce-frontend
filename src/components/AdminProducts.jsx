import { useState, useEffect } from 'react'
import '../style/AdminProducts.css';

const API = 'http://localhost:8080'

const AdminProducts = () => {
  const [productos, setProductos] = useState([])
  const [listaCategorias, setListaCategorias] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: '', descripcion: '', stock: '', imagen: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = () => localStorage.getItem('token')

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token()}`
  })

  // Función unificada para traer productos y categorías de forma eficiente
  const fetchProductsAndCategories = async () => {
    try {
      // 1. Traer Productos
      const resProd = await fetch(`${API}/api/productos`, { headers: headers() })
      const dataProd = await resProd.json()
      setProductos(Array.isArray(dataProd) ? dataProd : dataProd.products || [])

      // 2. Traer Categorías
      const resCat = await fetch(`${API}/api/categorias`, { headers: headers() })
      if (!resCat.ok) throw new Error('Error al cargar categorías')
      const dataCat = await resCat.json()
      setListaCategorias(dataCat)

      // Si hay categorías y no estamos editando, pre-seleccionamos el ID de la primera
      if (dataCat.length > 0 && !editing) {
        setForm(prev => ({ ...prev, categoria: dataCat[0].id_categoria || dataCat[0].id }))
      }

    } catch (err) {
      setError(err.message || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  // Un solo useEffect para la carga inicial
  useEffect(() => { 
    fetchProductsAndCategories() 
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    const primeraCat = listaCategorias.length > 0 ? (listaCategorias[0].id_categoria || listaCategorias[0].id) : ''
    setForm({ nombre: '', precio: '', categoria: primeraCat, descripcion: '', stock: '', imagen: '' })
    setEditing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const method = editing ? 'PUT' : 'POST'
    const url = editing
      ? `${API}/api/productos/${editing.id}`
      : `${API}/api/productos`

    const idCategoriaSeleccionada = Number(form.categoria);

    // Armamos el objeto dinámico con la categoría seleccionada en el menú
    const bodyRequest = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagen: form.imagen,
      categoriaIds: idCategoriaSeleccionada > 0 
        ? [idCategoriaSeleccionada] 
        : [listaCategorias[0]?.id_categoria || listaCategorias[0]?.id || 1]
    }

    try {
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(bodyRequest)
      })
      if (!res.ok) throw new Error('Error al guardar producto')
      resetForm()
      fetchProductsAndCategories() // Refresca la lista de productos en pantalla
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (producto) => {
    const categoriaActual = producto.categoriaIds && producto.categoriaIds.length > 0
      ? producto.categoriaIds[0]
      : (listaCategorias.length > 0 ? (listaCategorias[0].id_categoria || listaCategorias[0].id) : '')

    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: categoriaActual,
      descripcion: producto.descripcion,
      stock: producto.stock,
      imagen: producto.imagen || ''
    })
    setEditing(producto)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      const res = await fetch(`${API}/api/productos/${id}`, {
        method: 'DELETE',
        headers: headers()
      })
      if (!res.ok) throw new Error('Error al eliminar producto')
      fetchProductsAndCategories()
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
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="precio" placeholder="Precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required />
        
        {/* Menú desplegable dinámico conectado a la BD */}
        <select name="categoria" value={form.categoria} onChange={handleChange} required>
          {listaCategorias.length === 0 && <option value="">No hay categorías cargadas</option>}
          {listaCategorias.map(cat => {
            const idCat = cat.id_categoria || cat.id;
            return (
              <option key={idCat} value={idCat}>
                {cat.nombre}
              </option>
            )
          })}
        </select>
        
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required />
        <input name="imagen" placeholder="URL de imagen" value={form.imagen} onChange={handleChange} />
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
              <th>Imagen</th>
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
                <td>
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  ) : (
                    '📷 N/A'
                  )}
                </td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categorias ? p.categorias.join(', ') : 'Sin categoría'}</td>
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