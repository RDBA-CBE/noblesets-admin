import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import themeConfigSlice from './themeConfigSlice';
import authConfigSlice from './authConfigSlice';
import categoryConfigSlice from './categoryConfigSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    authConfig: authConfigSlice,
    categoryConfig: categoryConfigSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
