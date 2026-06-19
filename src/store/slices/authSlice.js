import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Leemos como texto por si el backend manda un string simple en lugar de JSON
        const errorData = await response.text(); 
        throw new Error(errorData || 'Error al iniciar sesión');
      }

      // aca antes devolvia el token, pero ahora el backend se encarga de la cookie, asi que no necesitamos nada del response
      // solo se devuelve un true en caso de exito
      return true; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// un thunk para el logout que invalide la cookie en el backend
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Para enviar la cookie a invalidar
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // aca ya no va el token porque el backend se encarga de la cookie,
    // asi que solo necesitamos saber si esta autenticado o no
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos de Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        // aca  se deberia setear el token si el backend lo devolviera, 
        // pero como ahora se maneja con cookie, no es necesario
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Casos de Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;