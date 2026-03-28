import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api';
import type { User } from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (response) => {
      console.log('Login success:', response.data);
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      queryClient.setQueryData(['user'], user);
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: any) => authApi.register(userData),
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      queryClient.setQueryData(['user'], user);
    },
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    queryClient.setQueryData(['user'], null);
    queryClient.clear();
    console.log('User logged out successfully');
  };

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      
      try {
        const response = await authApi.getProfile();
        return response.data;
      } catch (error) {
        console.error('Get profile error:', error);
        // Не вызываем logout здесь, чтобы избежать бесконечного цикла
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false, // Отключаем повторные запросы при фокусе
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isAuthenticated: !!user,
  };
};
