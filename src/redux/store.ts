import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cart";
import productReducer, { productApi } from "./slices/product";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productApi.reducerPath]: productReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
