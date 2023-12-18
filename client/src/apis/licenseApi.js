import axiosClient from './axiosClient';

export const getPagination = ({ _limit, _page, searchTerm }) => {
  const url = `/licenses?_page=${_page}&_limit=${_limit}&searchTerm=${searchTerm}`;
  return axiosClient.get(url);
};

export const removeAny = (data) => {
  const url = '/licenses';
  return axiosClient.delete(url, { data });
};

export const removeOne = (id) => {
  const url = `/licenses/${id}`;
  return axiosClient.delete(url);
};
