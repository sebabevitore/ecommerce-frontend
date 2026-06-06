import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], 
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { producto, cantidad = 1 } = action.payload;

            // Verificamos si el producto ya está en el carrito
            const existingItem = state.items.find(item => item.id === producto.id);

            if (existingItem) {
                // Si ya existe, sumamos la cantidad
                existingItem.quantity += cantidad;
            } else {
                // Si es nuevo, lo agregamos al array con su cantidad inicial
                state.items.push({ ...producto, quantity: cantidad });
            }
        },
        removeFromCart: (state, action) => {
            const idADescartar = action.payload;
            // Filtramos el array para eliminar el producto
            state.items = state.items.filter(item => item.id !== idADescartar);
        },
        updateQuantity: (state, action) => {
            const { id, cantidad } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += cantidad; // Suma o resta

                // lo borra si llega a 0
                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter(item => item.id !== id);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

// Exportamos las acciones para usarlas en los componentes con dispatch
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Exportamos el reducer para registrarlo en la Store
export default cartSlice.reducer;