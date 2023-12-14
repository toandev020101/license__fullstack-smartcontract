import axiosClient from './axiosClient';

export const getOneById = (id) => {
  const url = `/users/${id}`;
  return axiosClient.get(url);
};

export const addOne = (data) => {
  const url = '/users';
  return axiosClient.post(url, data);
};

export const updateOne = (formData) => {
  const url = '/users';
  return axiosClient.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
