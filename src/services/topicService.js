import apiClient from '../axiosInstance';

export const fetchTopics = async (page, size) => {
  const response = await apiClient.get(`/homepage/?page=${page}&size=${size}`);
  return response.data;
};
