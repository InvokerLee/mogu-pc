import request from '@/utils/request/index';

/** 用户管理 */
export function getUserList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data
  });
}

export function updateLevel(id, data) {
  return request({
    url: `/user/updateUserLevel/${id}`,
    method: 'patch',
    data
  });
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  });
}

export function editUser(id, data) {
  return request({
    url: `/user/editUser/${id}`,
    method: 'patch',
    data
  });
}

export function delUser(data) {
  return request({
    url: '/user/deleteUser',
    method: 'patch',
    data
  });
}

export function resetPassword(id, data) {
  return request({
    url: `/user/passwordReset/${id}`,
    method: 'patch',
    data
  });
}

export function getUserInfo() {
  return request({
    url: '/user/userMenu',
    method: 'get'
  });
}
