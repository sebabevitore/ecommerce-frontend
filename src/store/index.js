import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './slices/favoriteSlice';
import productReducer from './slices/productosSlice';

export const store = configureStore({
    reducer: {
        favorite: favoriteReducer,
        product : productReducer
    },

});






