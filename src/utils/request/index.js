import axios from 'axios';
import { Message } from 'element-ui';
import { getToken, setToken } from '@/utils/cookie';
// eslint-disable-next-line
import qs from 'qs';
import store from '@/store';

const INVALID_TOKENS = [];

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
  // withCredentials: true // 跨域允许携带cookie
});

// 请求拦截
request.interceptors.request.use((config) => {
  if (getToken()) {
    config.headers['x-token'] = getToken();
  }
  if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, err => Promise.reject(err));

// 响应拦截
request.interceptors.response.use((response) => {
  if (response.data.token) {
    setToken(response.data.token);
  }
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

// 通用下载方法
export function downloadFile(url, params) {
  const p = {};
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      p[key] = params[key];
    }
  });
  request({
    url,
    methods: 'get',
    params: p,
    responseType: 'blob'
  }).then((blob) => {
    console.log(blob);
    // download(blob, '123');
  }).catch(() => {});
}

export function download(content, fileName) {
  const blob = new Blob([content]);
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  const filename = fileName;
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default request;
