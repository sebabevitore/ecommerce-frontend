import { Link } from 'react-router-dom'
import '../style/Home.css'

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <h1>¡Bienvenido a nuestro E-commerce!</h1>
          <p className="hero-description">
            Descubre los mejores productos con los mejores precios. 
            Compra de forma fácil y segura desde la comodidad de tu hogar.
          </p>
          <Link to="/catalogo" className="btn-catalogo">
            Ver Catálogo de Productos
          </Link>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <i className="fa-solid fa-shopping-bag"></i>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature">
          <i className="fa-solid fa-truck"></i>
          <h3>Envío Rápido</h3>
          <p>Entrega a domicilio en 24-48 horas</p>
        </div>
        <div className="feature">
          <i className="fa-solid fa-lock"></i>
          <h3>100% Seguro</h3>
          <p>Compras seguras y protegidas</p>
        </div>
        <div className="feature">
          <i className="fa-solid fa-undo"></i>
          <h3>Devoluciones Fáciles</h3>
          <p>Devuelve tu compra sin complicaciones</p>
        </div>
        <div className="feature">
          <i className="fa-solid fa-headset"></i>
          <h3>Soporte 24/7</h3>
          <p>Atención al cliente disponible siempre</p>
        </div>
      </div>
    </div>
  )
}

export default Home
