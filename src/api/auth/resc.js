import request from '@/utils/request/index';

export function getResources(params) {
  return request({
    url: '/permission/resc',
    method: 'get',
    params,
  });
}

export function addResc(data) {
  return request({
    url: '/permission/addResc',
    method: 'post',
    data,
  });
}

export function editResc(id, data) {
  return request({
    url: `/permission/updateResc/${id}`,
    method: 'patch',
    data,
  });
}

export function delResc(data) {
  return request({
    url: '/permission/delResc',
    method: 'delete',
    data,
  });
}
