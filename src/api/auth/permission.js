import request from '@/utils/request/index';

export function getPermissionMenus() {
  return request({
    url: '/permission/menus',
    method: 'get',
  });
}

export function permissionSearch(params) {
  return request({
    url: '/permission/searchMenus',
    method: 'get',
    params,
  });
}

export function addPermission(data) {
  return request({
    url: '/permission/menus',
    method: 'post',
    data,
  });
}

export function editPermission(id, data) {
  return request({
    url: `/permission/menus/${id}`,
    method: 'patch',
    data,
  });
}

export function delPermission(data) {
  return request({
    url: '/permission/menus',
    method: 'delete',
    data,
  });
}

export function getBoundRescs(id, params) {
  return request({
    url: `/permission/boundMenuResc/${id}`,
    method: 'get',
    params,
  });
}

export function getUnboundRescs(id, params) {
  return request({
    url: `/permission/unboundMenuResc/${id}`,
    method: 'get',
    params,
  });
}

export function bindResc(id, data) {
  return request({
    url: `/permission/sevemenuResc/${id}`,
    method: 'post',
    data,
  });
}

export function unBindResc(id, data) {
  return request({
    url: `/permission/delMenuResc/${id}`,
    method: 'delete',
    data,
  });
}

export function clearPermissionRole(id) {
  return request({
    url: `/permission/delAUthMenu/${id}`,
    method: 'delete',
  });
}
