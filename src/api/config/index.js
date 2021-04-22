import request from '@/utils/request';

// 供应商
export function providerInfoList(data) {
  return request({
    url: '/providerinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addProvider(data) {
  return request({
    url: '/providerinfo/save',
    method: 'post',
    data
  });
}
export function editProvider(data) {
  return request({
    url: '/providerinfo/update',
    method: 'post',
    data
  });
}
export function delProvider(id) {
  return request({
    url: `/providerinfo/delete/${id}`,
    method: 'get'
  });
}

// 仓库
export function storeInfoList(data) {
  return request({
    url: '/storeinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addStore(data) {
  return request({
    url: '/storeinfo/save',
    method: 'post',
    data
  });
}
export function editStore(data) {
  return request({
    url: '/storeinfo/update',
    method: 'post',
    data
  });
}
export function delStore(id) {
  return request({
    url: `/storeinfo/delete/${id}`,
    method: 'get'
  });
}

// 类别
export function typeInfoList(data) {
  return request({
    url: '/typeinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addType(data) {
  return request({
    url: '/typeinfo/save',
    method: 'post',
    data
  });
}
export function editType(data) {
  return request({
    url: '/typeinfo/update',
    method: 'post',
    data
  });
}
export function delType(id) {
  return request({
    url: `/typeinfo/delete/${id}`,
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
