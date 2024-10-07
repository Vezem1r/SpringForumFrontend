import axios from 'axios';

const API_URL = 'http://localhost:8080/homepage';

export const fetchTopics = async (page, size) => {
  const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
  return response.data;
};
