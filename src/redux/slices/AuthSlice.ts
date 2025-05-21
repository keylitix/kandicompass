import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any;
  token: string | null;
}

const getFromLocalStorage = (key: string) => {
  const storedData = localStorage.getItem(key);
  try {
    return storedData ? JSON.parse(storedData) : null;
  } catch (e) {
    return storedData;
  }
};

const persistedUser = getFromLocalStorage('user');
const persistedToken = getFromLocalStorage('token');

const initialState: AuthState = {
  user: persistedUser || null,
  token: persistedToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
