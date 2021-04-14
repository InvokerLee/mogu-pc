import request from '@/utils/request/index';

/** 用户管理 */
export function getUserList(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function addUser(data) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data
  });
}

export function editUser(data) {
  return request({
    url: '/sys/user/update',
    method: 'patch',
    data
  });
}

export function delUser(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
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
