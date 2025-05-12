import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    catList:[]
};

const categoryConfigSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
       
        catList(state, { payload }) {
            state=payload
        },
        
    },
});

export const { catList} = categoryConfigSlice.actions;

export default categoryConfigSlice.reducer;
