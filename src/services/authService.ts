import axiosInstance from '@/utils/axiosInstance';

export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await axiosInstance.post('/register', data);
  return response.data;
};
export const signInUser = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.post('/login', data);
  return response.data;
};
