import axiosClient from './axiosClient';

export const getPagination = ({ _limit, _page, searchTerm }) => {
  const url = `/licenses?_page=${_page}&_limit=${_limit}&searchTerm=${searchTerm}`;
  return axiosClient.get(url);
};

export const checkFile = (formData) => {
  const url = '/licenses/file';
  return axiosClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addOne = (formData) => {
  const url = '/licenses';
  return axiosClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const removeAny = (data) => {
  const url = '/licenses';
  return axiosClient.delete(url, { data });
};

export const removeOne = (id) => {
  const url = `/licenses/${id}`;
  return axiosClient.delete(url);
};