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

export function delRole(data) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function getUsersByRoleId(id) {
  return request({
    url: `/permission/assignUser/${id}`,
    method: 'get'
  });
}

export function saveUsersByRoleId(id, data) {
  return request({
    url: `/permission/assignUser/${id}`,
    method: 'post',
    data
  });
}

export function searchRoleAuth(id) {
  return request({
    url: `/permission/searchAuthRole/${id}`,
    method: 'get'
  });
}

export function setRoleAuth(id, data) {
  return request({
    url: `permission/authRole/${id}`,
    method: 'post',
    data
  });
}
