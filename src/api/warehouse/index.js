import request from '@/utils/request/index';

// 库存
export function storestockList(data) {
  return request({
    url: '/storestock/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 出库
export function orderOutStoreInfoList(data) {
  return request({
    url: '/orderoutstoreinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 库存盘点
export function storecheckList(data) {
  return request({
    url: '/storecheck/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addStoreCheck(data) {
  return request({
    url: '/storecheck/save',
    method: 'post',
    data
  });
}
export function editStoreCheck(data) {
  return request({
    url: '/storecheck/update',
    method: 'post',
    data
  });
}
export function storeCheck(data) {
  return request({
    url: '/storecheck/check',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function delStorecheck(id) {
  return request({
    url: `/storecheck/delete/${id}`,
    method: 'get'
  });
}
export function storecheckInfo(id) {
  return request({
    url: `/storecheck/info/${id}`,
    method: 'get'
  });
}

export function getStorecheckdetailList(data) {
  return request({
    url: '/storecheckdetail/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function editStorecheckdetail(data) {
  return request({
    url: '/storecheckdetail/update',
    method: 'post',
    data
  });
}

export function delStorecheckdetail(id) {
  return request({
    url: `/storecheckdetail/delete/${id}`,
    method: 'get'
  });
}
