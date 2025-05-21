// userApi.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/user";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  pricePerUnit: number;
}

interface OrderHistory {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface Security {
  lastIpAddress: string;
  loginAttempts: number;
  securityQuestions: SecurityQuestion[];
}

interface Membership {
  subscriptionPlan: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  billingAddress: Address;
}

interface PortfolioItem {
  fileUrl: string;
  fileId: string;
}

interface Metadata {
  platform: string;
  os: string;
  browser: string;
  ip: string;
}

export interface User {
  id?: number;
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture?: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  role: string;
  accountStatus: string;
  lastLogin?: string;
  emailVerified: boolean;
  twoFactorAuthEnabled: boolean;
  membership?: Membership;
  orderHistory?: OrderHistory[];
  security?: Security;
  portfolio?: PortfolioItem[];
  metadata?: Metadata;
  token?: string;
  forgotPasswordOTP?: string;
  is_activated?: boolean;
  otp?: string;
  device_token?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchUsers = async (pageNo: number = 1, pageSize: number = 100): Promise<User[]> => {
  try {
   const token = localStorage.getItem('token') ;
    if (!token) {
      console.error('Auth token missing in localStorage');
      throw new Error('Auth token not found in localStorage');
    }
    const response = await axios.get(`${API_URL}/getall`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_no: pageNo, page_size: pageSize },
    });

    if (response.data.isSuccess) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || 'Failed to fetch users');
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const addUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ user: User; message: string; token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/create`, user);

    if (response.data.isSuccess) {
      const userData = response.data.data;
      const token = userData.token;
      localStorage.setItem('authToken', token);
      return {
        user: userData,
        message: response.data.message,
        token
      };
    }
    throw new Error(response.data.message || "Failed to create user");
  } catch (error: any) {
    console.error("Error adding user:", error.message);
    throw new Error(error.response?.data?.message || "Failed to add user");
  }
};

// ... (keep the rest of the API functions the same)

export const updateUser = async (id:any, user: Partial<User>): Promise<{ user: User; message: string }> => {
  try {
    const authToken = localStorage.getItem('authToken');  // Get the token from localStorage

    // Check if token is available
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.put(
      `${API_URL}/update/${id}`, 
      user,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,  // Add the token to the Authorization header
        },
      }
    );

    if (response.data.isSuccess) {
      return {
        user: response.data.data,
        message: response.data.message,
      };
    }
    
    throw new Error(response.data.message || "Failed to update user");
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (id: any): Promise<{ message: string; userId: number }> => {
  try {
    const token = localStorage.getItem('authToken')

    if (!token) {
      throw new Error('No authorization token found');
    }

    const response = await axios.delete(`${API_URL}/remove/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (response.data.isSuccess) {
      return {
        message: response.data.message,
        userId: id,
      };
    }
    throw new Error(response.data.message || 'Failed to delete user');
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};