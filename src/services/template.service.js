import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getTemplate = async () => {
  const response = await axios.get(`${API_URL}/client`);
  if (response.data.status === 'success') {
    return response.data;
  }
  throw new Error(response.data.message);
};

export default {
  getTemplate
};
