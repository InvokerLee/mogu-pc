import request from '@/utils/request/index';

export function getRoleList(data) {
  return request({
    url: '/sys/role/list',
    method: 'post',
    data
  });
}

export function addRole(data) {
  return request({
    url: '/permission/addRole',
    method: 'post',
    data
  });
}

export function editRole(id, data) {
  return request({
    url: `/permission/updateRole/${id}`,
    method: 'patch',
    data
  });
}

export function delRole(id) {
  return request({
    url: `/permission/delRoles/${id}`,
    method: 'delete'
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
