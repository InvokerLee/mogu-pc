import request from '@/utils/request';

export function getOrderList(data) {
  return request({
    url: '/orderinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addOrder(data) {
  return request({
    url: '/orderinfo/save',
    method: 'post',
    data
  });
}
export function editOrder(data) {
  return request({
    url: '/orderinfo/update',
    method: 'post',
    data
  });
}
export function delOrder(id) {
  return request({
    url: `/orderinfo/delete/${id}`,
    method: 'get'
  });
}
export function checkOrder(id) {
  return request({
    url: `/orderinfo/check/${id}`,
    method: 'get'
  });
}
