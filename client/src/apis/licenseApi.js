import axiosClient from './axiosClient';

export const getPagination = ({ _limit, _page, searchTerm }) => {
  const url = `/licenses?_page=${_page}&_limit=${_limit}&searchTerm=${searchTerm}`;
  return axiosClient.get(url);
};
