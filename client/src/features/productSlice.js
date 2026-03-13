import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        getProductsRequest: (state) => {
            state.loading = true;
        },
        getProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
        },
        getProductsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getProductDetailRequest: (state) => {
            state.loading = true;
        },
        getProductDetailSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload;
        },
        getProductDetailFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    getProductsRequest,
    getProductsSuccess,
    getProductsFail,
    getProductDetailRequest,
    getProductDetailSuccess,
    getProductDetailFail,
} = productSlice.actions;

export default productSlice.reducer;
