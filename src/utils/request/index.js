import axios from 'axios';
import { Message } from 'element-ui';
// import { getToken, setToken } from '@/utils/cookie';
// eslint-disable-next-line
import qs from 'qs';
import store from '@/store';

// const AUTH_KEY = 'Bearer';
const INVALID_TOKENS = [100001, 100002, 50012, 50014];

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
  // withCredentials: true // 跨域允许携带cookie
});

// 请求拦截
request.interceptors.request.use((config) => {
  // if (getToken()) {
  //   config.headers['Authorization'] = AUTH_KEY + getToken();
  // }
  if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, err => Promise.reject(err));

// 响应拦截
request.interceptors.response.use((response) => {
  // if (response.headers.authorization) {
  //   const token = response.headers.authorization.split(' ')[1];
  //   setToken(token);
  // }
  // blob
  if (response.config.responseType === 'blob') {
    return response;
  }
  // 成功
  if (response.data.code === 200) {
    return Promise.resolve(response.data);
  }
  if (INVALID_TOKENS.includes(response.data.code)) {
    store.dispatch('user/resetAll');
    location.reload();
    return;
  }

  // if (response.data.code === 100400) {
  //   // 错误
  //   Message.error({
  //     showClose: true,
  //     message: `${response.data.data} 无权限`
  //   });
  //   return Promise.reject(response);
  // }

  // 错误
  Message.error({
    showClose: true,
    message: response.data.msg || `Error:${response.request.url}`
  });
  return Promise.reject(response);
}, (error) => {
  Message.error({
    showClose: true,
    message: error.msg
  });
  return Promise.reject(error);
});

function formatParams(params) {
  let result = '';
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null) && !Object.is(JSON.stringify(params[key]), '{}')) {
      result += key + '=' + params[key] + '&';
    }
  });
  return result;
}
// 通用下载方法
export function downloadFile(url, params) {
  const p = formatParams(params);
  window.open(`${process.env.VUE_APP_BASE_API}${url}?${p}`);
}

export default request;
