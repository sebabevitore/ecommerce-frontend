import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

const customStorage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, item) => {
    localStorage.setItem(key, item);
    return Promise.resolve(item);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

import favoriteReducer from './slices/favoriteSlice';
import productReducer from './slices/productosSlice';
import cartReducer from './slices/cartSlice';
import categoriaReducer from './slices/categoriaSlice';
import authReducer from './slices/authSlice';

// 1. Combinamos los reducers
const rootReducer = combineReducers({
  favorite: favoriteReducer,
  products: productReducer,
  cart: cartReducer,
  categories: categoriaReducer,
  auth: authReducer,
});

// 2. Configuramos qué queremos persistir
const persistConfig = {
  key: 'root',
  storage: customStorage, // Usamos nuestro propio storage que acabamos de crear
  whitelist: ['auth'], 
};

// 3. Creamos el reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);