import request from '@/utils/request/index';

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  });
}

