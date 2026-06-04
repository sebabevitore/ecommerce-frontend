import React, { useState, useContext, createContext } from 'react';


const FavoriteContext = createContext();



export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite debe ser usado dentro de un FavoriteProvider');
  }
  return context;
}

export function FavoriteProvider({ children }) {
    const [favoriteItems, setFavoriteItems] = useState([]);

    const addToFavorites = (product) => {
        setFavoriteItems(prev => [...prev, product]);
        console.log('Producto agregado a favoritos:', product);
    };

    const value = { favoriteItems, addToFavorites };


    return (
        <FavoriteContext.Provider value={value}>
            {children}
        </FavoriteContext.Provider>
    );
}