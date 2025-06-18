import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to IP if using physical phone
  responseType: 'json',
  withCredentials: true,
});

export default Api;
