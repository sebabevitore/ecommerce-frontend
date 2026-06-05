import { createSlice } from '@reduxjs/toolkit';


const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        items: [],
    },
    

    reducers: {
        addToFavorite: (state, action) => {
            const product = action.payload;
            const existingProduct = state.items.find(item => item.id === product.id);

            if (!existingProduct) {
                state.items.push(product);
            }

        },

        removeFavorite: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },

        clearFavorites: (state) => {
            state.items = [];
        }
    }
});

export const { addToFavorite, removeFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;