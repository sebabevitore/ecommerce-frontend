import {BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ProductCatalog from './components/ProductCatalog'
import Login from './components/Login'
import Register from './components/Register'
import AdminProducts from './components/AdminProducts'
import ProductDetail from './components/ProductDetail'
import Carrito from './components/Carrito'
import FavoritesList from './components/FavoriteList' 
import Checkout from './components/Checkout'
import './App.css'

// import ProductList from './ProductList.jsx';
// import CartSummary from './CartSummary.jsx';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="nav-brand">E-commerce-UADE</Link>
        <div className="nav-links">
          <Link to="/"><i className="fa-solid fa-house" style={{color: 'rgb(26, 26, 26)'}}></i> Inicio</Link>
          <Link to="/login"><i className="fa-solid fa-circle-user" style={{color: 'rgb(26, 26, 26)'}}></i> Iniciar Sesión</Link>
          <Link to="/register"><i className="fa-solid fa-users" style={{color: 'rgb(26, 26, 26)'}}></i> Registrarse</Link>
          <Link to="/admin"><i className="fa-solid fa-key" style={{color: 'rgb(26, 26, 26)'}}></i> Admin</Link>
          <Link to="/carrito">
            <i className="fa-solid fa-cart-shopping" style={{color: 'rgb(26, 26, 26)'}}></i> Carrito
          </Link>
          <Link to="/favorites">
            <i className="fa-solid fa-heart" style={{color: 'rgb(26, 26, 26)'}}></i> Favoritos
          </Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminProducts />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/favorites" element={<FavoritesList />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>API TPO</p>
      </footer>
    </BrowserRouter>
  )
}

export default App
