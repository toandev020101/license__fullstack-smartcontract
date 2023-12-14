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

export const logout = () => {
  const url = '/logout';
  return axiosClient.get(url);
};
