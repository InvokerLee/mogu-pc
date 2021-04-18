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
    method: 'post',
    data
  });
}

export function delUser(id) {
  return request({
    url: `/sys/user/delete/${id}`,
    method: 'get'
  });
}

export function editPwd(data) {
  return request({
    url: '/sys/user/password',
    method: 'post',
    data
  });
}

export function getUserInfo() {
  return request({
    url: '/user/userMenu',
    method: 'get'
  });
}
