import axiosClient from './axiosClient';

export const login = (data) => {
  const url = '/login';
  return axiosClient.post(url, data);
};

export const register = (data) => {
  const url = '/register';
  return axiosClient.post(url, data);
};

export const refreshToken = () => {
  const url = '/refresh-token';
  return axiosClient.get(url);
};

export const logout = (id) => {
  const url = `/logout/${id}`;
  return axiosClient.get(url);
};
