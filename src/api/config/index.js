import request from '@/utils/request';

// 职员
export function staffInfoList(data) {
  return request({
    url: '/staffinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addStaff(data) {
  return request({
    url: '/staffinfo/save',
    method: 'post',
    data
  });
}
export function editStaff(data) {
  return request({
    url: '/staffinfo/update',
    method: 'post',
    data
  });
}
export function delStaff(data) {
  return request({
    url: '/staffinfo/delete',
    method: 'post',
    data
  });
}
