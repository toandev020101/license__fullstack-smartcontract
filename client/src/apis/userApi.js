import axiosClient from './axiosClient';

export const getOneById = (id) => {
  const url = `/users/${id}`;
  return axiosClient.get(url);
};

export const updateOne = (formData) => {
  const url = '/users';
  return axiosClient.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changePassword = (data) => {
  const url = '/users';
  return axiosClient.patch(url, data);
};
