import request from '@/utils/request/index';

export function sysconfigList(data) {
  return request({
    url: '/sysconfig/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function addSys(data) {
  return request({
    url: '/sysconfig/save',
    method: 'post',
    data
  });
}
export function editSys(data) {
  return request({
    url: '/sysconfig/update',
    method: 'post',
    data
  });
}

export function delSet(data) {
  return request({
    url: '/sysconfig/delete',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
