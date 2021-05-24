import request from '@/utils/request/index';

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  });
}

