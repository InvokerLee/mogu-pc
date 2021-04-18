import request from '@/utils/request/index';

export function getRoleList(data) {
  return request({
    url: '/sys/role/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function addRole(data) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data
  });
}

export function editRole(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data
  });
}

export function getRoleInfo(roleId) {
  return request({
    url: `/sys/role/info/${roleId}`,
    method: 'get'
  });
}

export function delRole(id) {
  return request({
    url: `/sys/role/delete/${id}`,
    method: 'get'
  });
}

export function getAllMenus() {
  return request({
    url: '/sys/menu/select',
    method: 'post'
  });
}

export function getRoleMenus(data) {
  return request({
    url: '/sys/role/select/auth/menu',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function bindMenusForRole(data) {
  return request({
    url: '/sys/role/auth/menu',
    method: 'post',
    data
  });
}

export function getAllUsers() {
  return request({
    url: '/sys/user/select',
    method: 'post'
  });
}

export function bindUsersForRole(data) {
  return request({
    url: '/sys/role/auth/user',
    method: 'post',
    data
  });
}
export function getRoleBindUsers(data) {
  return request({
    url: '/sys/role/select/auth/user',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
