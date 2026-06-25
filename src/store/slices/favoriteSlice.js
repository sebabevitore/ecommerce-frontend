import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// createAsyncThunk crear acciones asincrónicas, genera las acciones pending, fulfilled y rejected para manejar el estado de la petición
export const fetchFavoriteItems = createAsyncThunk(
  'favorite/fetchFavoriteItems',
  async (_, { getState }) => {
    const response = await fetch('http://localhost:8080/api/favoritos', {
      method: 'GET',
      headers: getAuthHeaders(getState),
      credentials: 'include',
      mode: 'cors'
    });
    if (!response.ok) throw new Error('Error al obtener los favoritos');

    return await response.json();
  }
);

export const addFavoriteAsync = createAsyncThunk(
  'favorite/addFavoriteAsync',
  async (productoId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/favoritos/productos/${productoId}`, {
        method: 'POST',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) throw new Error('Error al agregar a favoritos');
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  'favorite/removeFavoriteAsync',
  async (productoId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/favoritos/productos/${productoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) throw new Error('Error al eliminar de favoritos');
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearFavoritesAsync = createAsyncThunk(
  'favorite/clearFavoritesAsync',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/favoritos', {
        method: 'DELETE',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) throw new Error('Error al vaciar los favoritos');
      
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    items: [],
    loading: false,
    error: null
  },


  reducers: {},

  // extraReducers maneja las acciones generadas por createAsyncThunk (fetchCartItems) para actualizar el estado de carga y error al obtener los items del carrito desde la API
  // reducers acciones externas
  // builder es un objeto que permite agregar casos para manejar las acciones generadas por createAsyncThunk
  extraReducers: (builder) => {
    builder
      // GET FAVORITOS
      .addCase(fetchFavoriteItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteItems.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFavoriteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // AGREGAR A FAVORITOS
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // REMOVER DE FAVORITOS
      .addCase(removeFavoriteAsync.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      
      // VACIAR FAVORITOS
      .addCase(clearFavoritesAsync.fulfilled, (state, action) => {
        state.items = [];
      });
  }
});

export const { removeFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;