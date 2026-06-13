import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api/carrito';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    //le agrega Bearer antes del token
    'Authorization': token ? `Bearer ${token}` : ''
}};


// ACCIONES ASINCRÓNICAS (THUNKS)

// Traer el carrito del backend 
export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async () => {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener el carrito');
        // El backend devuelve { items: [...], total: 0.0 }
        return await response.json();
    }
);

// Agregar item
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productoId, cantidad }) => {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: getAuthHeaders(),
            // mandamos id_producto tal como lo pide ItemCarritoRequest.java
            body: JSON.stringify({ id_producto: productoId, cantidad: cantidad })
        });
        if (!response.ok) throw new Error('Error al agregar producto');
        return await response.json();
    }
);
//actualizar cantidad (sumar o restar)
export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ itemId, cantidad, productoId }) => {
        const response = await fetch(`${API_URL}/items/${itemId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            // segun body del DTO
            body: JSON.stringify({ id_producto: productoId, cantidad: cantidad })
        });
        if (!response.ok) throw new Error('Error al actualizar cantidad');
        return await response.json();
    }
);

// Eliminar un producto por completo
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId) => {
        const response = await fetch(`${API_URL}/items/${itemId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar producto');
        return await response.json();
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async () => {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error al vaciar el carrito');
        // Como tu controller devuelve ResponseEntity.noContent() (vacío), nosotros retornamos la estructura inicial limpia
        return { items: [], total: 0 };
    }
);


// SLICE (ESTADO Y REDUCERS)

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        // si no manejamos nada local, no hay nada
    },
    extraReducers: (builder) => {
        builder
            //TRAER CARRITO
            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                // action.payload es el CarritoResponse.java entero
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.loading = false;
            })

            // action en este caso trae el error generado al intentar obtener los items del carrito desde la API. También se actualiza el estado de carga y error.
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // AGREGAR, MODIFICAR O BORRAR ITEM
            //todos estos métodos devuelven un CarritoResponse actualizado:
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
        .addCase(updateQuantity.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.total = action.payload.total;
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {
            state.items = action.payload.items;
            state.total = action.payload.total;
        })

        //VACIAR CARRITO
        .addCase(clearCart.fulfilled, (state, action) => {
            state.items = action.payload.items; // Estará vacío
            state.total = action.payload.total; // Será 0
        });
}
});

// ya no exportamos acciones normales (actions), ahora todo se maneja mediante los Thunks 
export default cartSlice.reducer;