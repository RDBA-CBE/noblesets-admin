import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    catList: [],
    productPreview: null,
};

const channelSlice = createSlice({
    name: 'channel',
    initialState: initialState,
    reducers: {
        catList(state, { payload }) {
            state = payload;
        },
        productPreview(state, { payload }) {
            state.productPreview = payload;
        },
    },
});

export const { catList, productPreview } = channelSlice.actions;

export default channelSlice.reducer;
