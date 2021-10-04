import axios from 'axios'; // 引入axios

const BASE_URL = 'https://api-ropsten.etherscan.io';
const service = axios.create({
  baseURL: BASE_URL,
  timeout: 99999,
});

service.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {};
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
      config.data = JSON.stringify(config.data);
    }

    return config;
  },
  (error) => {
    console.log('request error', error);
    return error;
  }
);

export default service;
