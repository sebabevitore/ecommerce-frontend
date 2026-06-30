import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api/carrito';

const getAuthHeaders = (getState) => {
    const token = getState().auth.token;
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
    async (_, { getState }) => {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getAuthHeaders(getState),
        });
        if (!response.ok) throw new Error('Error al obtener el carrito');
        // El backend devuelve { items: [...], total: 0.0 }
        return await response.json();
    }
);

// Agregar item
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productoId, cantidad }, { getState }) => {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: getAuthHeaders(getState),
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
    async ({ itemId, cantidad, productoId }, { getState }) => {
        const response = await fetch(`${API_URL}/items/${itemId}`, {
            method: 'PUT',
            headers: getAuthHeaders(getState),
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
    async (itemId, { getState }) => {
        const response = await fetch(`${API_URL}/items/${itemId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(getState),
        });
        if (!response.ok) throw new Error('Error al eliminar producto');
        return await response.json();
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { getState }) => {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: getAuthHeaders(getState),
        });
        if (!response.ok) throw new Error('Error al vaciar el carrito');
        // Como tu controller devuelve ResponseEntity.noContent() (vacío), nosotros retornamos la estructura inicial limpia
        return { items: [], total: 0 };
    }
);

// PROCESAR COMPRA (CHECKOUT)
export const checkoutCart = createAsyncThunk(
    'cart/checkoutCart',
    async (pedidoPayload, { rejectWithValue, getState }) => {
        try {
            const response = await fetch('http://localhost:8080/api/pedidos', {
                method: 'POST',
                headers: getAuthHeaders(getState),
                body: JSON.stringify(pedidoPayload)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al procesar la compra (posible falta de stock)');
            }

            // Dependiendo de lo que devuelva tu backend (si devuelve el PedidoResponse o nada)
            // Si devuelve 200/201 sin body, podés simplemente retornar true
            return true; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
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
        
        .addCase(checkoutCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(checkoutCart.fulfilled, (state) => {
            state.loading = false;
            // Si la compra fue un éxito, vaciamos el carrito localmente
            state.items = [];
            state.total = 0;
        })
        .addCase(checkoutCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
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
