import axios from 'axios';

export const isEmptyObject = (obj) => {
  if (!obj) return true;
  return obj && Object.keys(obj).length === 0;
};


const instance = axios.create({
  // 配置你的 Axios 实例
  baseURL: 'http://192.168.180.67:3032/api',
  timeout: 5000, // 请求超时时间
  // 可以在这里添加其他的 Axios 配置
});

export default instance;