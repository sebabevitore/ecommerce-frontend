import { Routes, Route, Link } from 'react-router-dom'
import ProductCatalog from './components/ProductCatalog'
import Login from './components/Login'
import Register from './components/Register'
import AdminProducts from './components/AdminProducts'
import ProductDetail from './components/ProductDetail'
import UserOrders from './components/UserOrders'

import './App.css'

function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-brand">E-commerce-UADE</Link>
        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/mis-pedidos">Mis pedidos</Link>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminProducts />} />
          <Route path="/mis-pedidos" element={<UserOrders />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>API TPO</p>
      </footer>
    </>
  )
}

export default App
