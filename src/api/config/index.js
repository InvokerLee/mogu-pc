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
export function delStaff(id) {
  return request({
    url: `/staffinfo/delete/${id}`,
    method: 'get'
  });
}

// 品牌
export function brandInfoList(data) {
  return request({
    url: '/brandinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addBrand(data) {
  return request({
    url: '/brandinfo/save',
    method: 'post',
    data
  });
}
export function editBrand(data) {
  return request({
    url: '/brandinfo/update',
    method: 'post',
    data
  });
}
export function delBrand(id) {
  return request({
    url: `/brandinfo/delete/${id}`,
    method: 'get'
  });
}
