import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cart";
import productReducer, { productApi } from "./slices/product";
import usersReducer, { authSlice, usersApi } from "./slices/user";
import orderReducer, { orderApi } from "./slices/order";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productApi.reducerPath]: productReducer,
    [usersApi.reducerPath]: usersReducer,
    [orderApi.reducerPath]: orderReducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(usersApi.middleware)
      .concat(orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
