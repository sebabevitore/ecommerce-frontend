import { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setProductos, setCategorias, setLoading, setError } from '../store/slices/productosSlice';
import { setSelectedCategory } from '../store/slices/productosSlice';
import ProductCard from './ProductCard'
import "../style/ProductCatalog.css"


import CategoryList from './CategoryList';

const API = 'http://localhost:8080'

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const { items: productos, categorias, loading, error, selectedCategory } = useSelector(state => state.products);

  const handleCategorySelect = (categoryId) => {
  dispatch(setSelectedCategory(categoryId));
};

  // Función unificada para traer productos y categorías de forma eficiente
  const fetchProductsAndCategories = async () => {
    try {
      dispatch(setLoading(true));
      const resProd = await fetch(`${API}/api/productos`)
      const dataProd = await resProd.json()
      dispatch(setProductos(Array.isArray(dataProd) ? dataProd : dataProd.products || []))

      // 2. Traer Categorías
      const resCat = await fetch(`${API}/api/categorias`)
      if (!resCat.ok) throw new Error('Error al cargar categorías')
      const dataCat = await resCat.json()
      dispatch(setCategorias(dataCat))

    } catch (err) {
      dispatch(setError(err.message || 'Error al cargar datos'))
    } finally {
      dispatch(setLoading(false))
    }
  }
    // Un solo useEffect para la carga inicial
  useEffect(() => { 
    fetchProductsAndCategories() 
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

// 1. Averiguamos el nombre de la categoría que llega (si es que llega)
const categoriaEncontrada = selectedCategory 
  ? categorias.find(cat => cat.id === selectedCategory) 
  : null;

// 2. Ahora filtramos los productos
const productosFiltrados = categoriaEncontrada
  ? productos.filter(producto => {
      return producto.categorias && producto.categorias.includes(categoriaEncontrada.nombre);
    })
  : productos; // Si no hay categoría encontrada (o selectedCategory es null), muestra todo

  return (
    <div className="catalog-container">
      <h2>Catálogo de Productos</h2>
      <div className="catalog-layout">
        <CategoryList 
          categories={categorias} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory} 
        />

        <div className="catalog-main">
          <div className="product-grid">
            {productosFiltrados.length === 0 && <p>No hay productos disponibles.</p>}
            {productosFiltrados.map(producto => (
              <ProductCard
                key={producto.id} 
                producto={producto}
                precioFormateado={formatearPrecio(producto.precio)}>
              </ProductCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog
