// client/api/api.js
const Api = axios.create({
  baseURL: 'http://localhost:5000/api',
  responseType: 'json',
});
