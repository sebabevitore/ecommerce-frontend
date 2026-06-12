import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './slices/favoriteSlice';
import productReducer from './slices/productosSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        favorite: favoriteReducer,
        products: productReducer,
        cart: cartReducer,
        auth: authReducer
    },
});