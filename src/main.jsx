import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductCard from './ejemplos/ProductCard.jsx'
import ProductList from './ejemplos/ProductList.jsx'
import TwitterCard from './ejemplos/TwitterFollowCard.jsx'
import Video from './ejemplos/Video.jsx'
import OnOff from './ejemplos/OnOff.jsx'
import Card from './ejemplos/Card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<OnOff/>*/}
    <ProductList />
    
    {/* EJEMPLOS INDIVIDUALES DE PRODUCTCARD CON CHILDREN */}
    {/*
    <ProductCard nombre="Monitor" precio="12890" />
    <ProductCard nombre="Mouse" precio="25.990" />
    
      <ProductCard nombre="Teclado" precio="30.990">
        {/* Todo esto de acá abajo es el CHILDREN */}
        {/*<p>Teclado Blanco</p>
        <button>Comprar ahora</button>
        <OnOff />
      </ProductCard> 
    */}
    

    
    {/* <Card userName='jperez' onFollow='true' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan la tecnología</p>
      <div>
        <a href="">Link a Facebook</a>
        <a href="">Link a Instagram</a>
      </div>
      <OnOff />
    </Card>
    <Card userName='hperez' onFollow='true' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan viajar</p>
      <OnOff />
    </Card>     */}

  </StrictMode>,
)
