import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          return api.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const ingredientsApi = {
  getAll: () => api.get('/ingredients'),
  getById: (id: number) => api.get(`/ingredients/${id}`),
  getCategories: () => api.get('/ingredients/categories'),
  create: (data: any) => api.post('/ingredients', data),
  update: (id: number, data: any) => api.patch(`/ingredients/${id}`, data),
  delete: (id: number) => api.delete(`/ingredients/${id}`),
};

export const dishesApi = {
  getAll: () => api.get('/dishes'),
  getById: (id: number) => api.get(`/dishes/${id}`),
  getTypes: () => api.get('/dishes/types'),
  match: (ingredients: { id: number; quantity: number }[], includeExtra = false) =>
    api.post('/dishes/match', { ingredients, includeExtra }),
  create: (data: any) => api.post('/dishes', data),
  update: (id: number, data: any) => api.patch(`/dishes/${id}`, data),
  delete: (id: number) => api.delete(`/dishes/${id}`),
};

export const ordersApi = {
  getAll: () => api.get('/orders'),
  getAllOrders: () => api.get('/orders'), // Для EmployeeDashboard
  getById: (id: number) => api.get(`/orders/${id}`),
  getStatuses: () => api.get('/orders/statuses'),
  create: (dishes: number[]) => api.post('/orders', { IDDishes: dishes }),
  updateStatus: (id: number, statusId: number) =>
    api.patch(`/orders/${id}/status`, { statusId }),
  updateOrderStatus: (id: number, statusId: number) => // Для EmployeeDashboard
    api.patch(`/orders/${id}/status`, { statusId }),
  delete: (id: number) => api.delete(`/orders/${id}`),
};
