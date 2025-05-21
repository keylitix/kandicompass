import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import { beadApi } from '../api/beadApi';
import { threadApi } from '../api/thredApi';
import { authApi } from '../api/AuthApi';
import authReducer from '../slices/AuthSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [beadApi.reducerPath]: beadApi.reducer,
    [threadApi.reducerPath]: threadApi.reducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(beadApi.middleware)
      .concat(threadApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



