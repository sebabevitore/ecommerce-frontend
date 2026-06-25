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
  async (productoId, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/favoritos/productos/${productoId}`, {
        method: 'POST',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) throw new Error('Error al agregar a favoritos');

      // Actualizamos la lista llamando al backend otra vez
      dispatch(fetchFavoriteItems());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  'favorite/removeFavoriteAsync',
  async (productoId, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8080/api/favoritos/productos/${productoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) throw new Error('Error al eliminar de favoritos');

      dispatch(fetchFavoriteItems());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearFavoritesAsync = createAsyncThunk(
  'favorite/clearFavoritesAsync',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/favoritos', {
        method: 'DELETE',
        headers: getAuthHeaders(getState)
      });

      if (!response.ok) throw new Error('Error al vaciar los favoritos');

      dispatch(fetchFavoriteItems());
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
      //fetchFavoriteItems genera tres acciones automáticamente: pending (cuando la petición está en curso), 
      // fulfilled (cuando la petición se completa exitosamente) y rejected (cuando la petición falla)
      .addCase(fetchFavoriteItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      //action en este caso trae el payload con los items del carrito obtenidos desde la API. También se actualiza el estado de carga y error.
      .addCase(fetchFavoriteItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      // action en este caso trae el error generado al intentar obtener los items del carrito desde la API. También se actualiza el estado de carga y error.
      .addCase(fetchFavoriteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { removeFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;