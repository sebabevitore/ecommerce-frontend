import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categorias: [],
    loading: false,
    error: null,
    selectedCategory: null,
  },
  
  reducers: {
    setProductos(state, action) {
      state.items = action.payload;
    },
    setCategorias(state, action) {
      state.categorias = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
});

export const { 
  setProductos, 
  setCategorias, 
  setLoading, 
  setError,
  setSelectedCategory 
} = productSlice.actions;

export default productSlice.reducer;