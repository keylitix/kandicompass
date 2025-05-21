import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers, addUser,User, deleteUser, updateUser} from "../api/userApi";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  token: localStorage.getItem('authToken') || null,
};

const transformUser = (apiUser: any): User => ({
  id: apiUser.id || 0,
  fullName: apiUser.fullName || '',
  username: apiUser.username || '',
  email: apiUser.email || '',
  phoneNumber: apiUser.phoneNumber || '',
  profilePicture: apiUser.profilePicture,
  dateOfBirth: apiUser.dateOfBirth || '',
  gender: apiUser.gender || '',
  address: {
    street: apiUser.address?.street || '',
    city: apiUser.address?.city || '',
    state: apiUser.address?.state || '',
    zipCode: apiUser.address?.zipCode || '',
    country: apiUser.address?.country || ''
  },
  role: apiUser.role || 'Customer',
  accountStatus: apiUser.accountStatus || 'Active',
  password: apiUser.password,
  lastLogin: apiUser.lastLogin,
  emailVerified: apiUser.emailVerified || false,
  twoFactorAuthEnabled: apiUser.twoFactorAuthEnabled || false,
  membership: apiUser.membership ? {
    subscriptionPlan: apiUser.membership.subscriptionPlan || '',
    startDate: apiUser.membership.startDate || '',
    endDate: apiUser.membership.endDate || '',
    paymentMethod: apiUser.membership.paymentMethod || '',
    billingAddress: {
      street: apiUser.membership.billingAddress?.street || '',
      city: apiUser.membership.billingAddress?.city || '',
      state: apiUser.membership.billingAddress?.state || '',
      zipCode: apiUser.membership.billingAddress?.zipCode || '',
      country: apiUser.membership.billingAddress?.country || ''
    }
  } : undefined,
  orderHistory: apiUser.orderHistory?.map((order: any) => ({
    orderId: order.orderId || 0,
    orderDate: order.orderDate || '',
    status: order.status || '',
    totalAmount: order.totalAmount || 0,
    items: order.items?.map((item: any) => ({
      productId: item.productId || 0,
      productName: item.productName || '',
      quantity: item.quantity || 0,
      pricePerUnit: item.pricePerUnit || 0
    })) || []
  })),
  security: apiUser.security ? {
    lastIpAddress: apiUser.security.lastIpAddress || '',
    loginAttempts: apiUser.security.loginAttempts || 0,
    securityQuestions: apiUser.security.securityQuestions?.map((q: any) => ({
      question: q.question || '',
      answer: q.answer || ''
    })) || []
  } : undefined,
  createdAt: apiUser.createdAt,
  updatedAt: apiUser.updatedAt
});

export const getUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchUsers();
      return users.map(transformUser);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk<User, Omit<User, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await addUser(userData);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return transformUser(response.user);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const editUser = createAsyncThunk<User, { id: number; userData: Partial<User> }, { rejectValue: string }>(
  "user/editUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await updateUser(id, userData);
      return transformUser(response.user);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeUser = createAsyncThunk<number, number, { rejectValue: string }>(
  "user/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('authToken');
    },
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
    updateUserState: (state, action: PayloadAction<Partial<User>>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching users";
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error creating user";
      })
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating user";
      })
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error deleting user";
      });
  },
});

export const { logout, clearUsers, updateUserState } = userSlice.actions;
export default userSlice.reducer;