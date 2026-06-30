import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../style/AdminProducts.css';

const API = 'http://localhost:8080'

const AdminProducts = () => {
  const [productos, setProductos] = useState([])
  const [listaCategorias, setListaCategorias] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: '', categoria: '', descripcion: '', stock: '', imagenUrl: '', freeShipping: false, isPromo: false })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = useSelector((state) => state.auth.token)

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })

  const fetchProductsAndCategories = async () => {
    try {
      const resProd = await fetch(`${API}/api/productos`, { headers: headers() })
      const dataProd = await resProd.json()
      setProductos(Array.isArray(dataProd) ? dataProd : dataProd.products || [])

      const resCat = await fetch(`${API}/api/categorias`, { headers: headers() })
      if (!resCat.ok) throw new Error('Error al cargar categorías')
      const dataCat = await resCat.json()
      setListaCategorias(dataCat)

      if (dataCat.length > 0 && !editing) {
        setForm(prev => ({ ...prev, categoria: dataCat[0].id_categoria || dataCat[0].id }))
      }

    } catch (err) {
      setError(err.message || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchProductsAndCategories() 
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const resetForm = () => {
    const primeraCat = listaCategorias.length > 0 ? (listaCategorias[0].id_categoria || listaCategorias[0].id) : ''
    setForm({ 
      nombre: '', precio: '', categoria: primeraCat, descripcion: '', stock: '', imagenUrl: '',
      freeShipping: false, isPromo: false
    })
    setEditing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // CORREGIDO: Usar id_prod para la URL del PUT
    const method = editing ? 'PUT' : 'POST'
    const url = editing
      ? `${API}/api/productos/${editing.id_prod || editing.id}`
      : `${API}/api/productos`

    const idCategoriaSeleccionada = Number(form.categoria);

    const bodyRequest = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagenUrl: form.imagenUrl,
      freeShipping: Boolean(form.freeShipping), // Asegura booleano puro
      isPromo: Boolean(form.isPromo),           // Asegura booleano puro
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
      if (!res.ok) {
        let errorMsg = 'Error al guardar producto';
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch (e) {
          // If response is not JSON
        }
        throw new Error(errorMsg);
      }
      resetForm()
      fetchProductsAndCategories() 
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (producto) => {
    let categoriaActual = listaCategorias.length > 0 ? (listaCategorias[0].id_categoria || listaCategorias[0].id) : ''
    if (producto.categorias && producto.categorias.length > 0) {
      const nombreCat = producto.categorias[0]
      const catObj = listaCategorias.find(c => c.nombre === nombreCat)
      if (catObj) categoriaActual = catObj.id_categoria || catObj.id
    }

    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: categoriaActual,
      descripcion: producto.descripcion,
      stock: producto.stock,
      imagenUrl: producto.imagenUrl || '',
      freeShipping: producto.freeShipping || false,
      isPromo: producto.isPromo || false // CORREGIDO: alineado con backend
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
      if (!res.ok) {
        let errorMsg = `Error al eliminar producto (Status: ${res.status})`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch (e) {
          // If response is not JSON
        }
        throw new Error(errorMsg);
      }
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
        <input name="imagenUrl" placeholder="URL de imagen" value={form.imagenUrl} onChange={handleChange} />

        <label className="checkbox-label">
          <input type="checkbox" name="freeShipping" checked={form.freeShipping} onChange={handleChange} />
          ✈️ Envío Gratis
        </label>

        <label className="checkbox-label">
          <input type="checkbox" name="isPromo" checked={form.isPromo} onChange={handleChange} />
          🔥 Promo
        </label>

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
              <th>Envío/Promo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => {
              const currentId = p.id_prod || p.id; // CORREGIDO: Prioriza id_prod de Spring Boot
              return (
                <tr key={currentId}>
                  <td>
                    {p.imagenUrl ? (
                      <img src={p.imagenUrl} alt={p.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    ) : (
                      '📷 N/A'
                    )}
                  </td>
                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>
                    {p.categorias && Array.isArray(p.categorias)
                      ? p.categorias.map(c => c.nombre || c).join(', ') // CORREGIDO: Muestra el texto, no [object Object]
                      : 'Sin categoría'}
                  </td>
                  <td>{p.stock}</td>
                  
                  <td>
                    {p.freeShipping && <span title="Envío gratis">✈️</span>}{' '}
                    {(p.isPromo || p.promo) && <span title="Promo">🔥</span>} 
                    {!p.freeShipping && !p.isPromo && !p.promo && '—'}
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(currentId)}>Eliminar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {productos.length === 0 && <p className="empty">No hay productos</p>}
      </div>
    </div>
  )
}

export default AdminProducts;