import request from '@/utils/request/index';

// 入库
export function orderInStoreInfoList(data) {
  return request({
    url: '/orderinstoreinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function inStockCheck(data) {
  return request({
    url: '/orderinstoreinfo/check',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function delInStock(id) {
  return request({
    url: `/orderinstoreinfo/delete/${id}`,
    method: 'get'
  });
}
export function inStockAdd(data) {
  return request({
    url: '/orderinstoreinfo/save',
    method: 'post',
    data
  });
}
export function inStockEdit(data) {
  return request({
    url: '/orderinstoreinfo//update',
    method: 'post',
    data
  });
}
export function inStockInfo(id) {
  return request({
    url: `/orderinstoreinfo/info/${id}`,
    method: 'get'
  });
}

export function inStoreDetailList(data) {
  return request({
    url: '/orderinstoredetail/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function delInStockDetail(data) {
  return request({
    url: `/orderinstoredetail/delete`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function inStockDetailEdit(data) {
  return request({
    url: '/orderinstoredetail/update',
    method: 'post',
    data
  });
}

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
export function outStockAdd(data) {
  return request({
    url: '/orderoutstoreinfo/save',
    method: 'post',
    data
  });
}
export function outStockEdit(data) {
  return request({
    url: '/orderoutstoreinfo//update',
    method: 'post',
    data
  });
}
export function outStockInfo(id) {
  return request({
    url: `/orderoutstoreinfo/info/${id}`,
    method: 'get'
  });
}
export function outStockCheck(data) {
  return request({
    url: '/orderoutstoreinfo/check',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function delOutStock(id) {
  return request({
    url: `/orderoutstoreinfo/delete/${id}`,
    method: 'get'
  });
}
export function outStoreDetailList(data) {
  return request({
    url: '/outstoredetail/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function delOutStockDetail(data) {
  return request({
    url: `/outstoredetail/delete`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function outStockDetailEdit(data) {
  return request({
    url: '/outstoredetail/update',
    method: 'post',
    data
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

export function storeDetailStoreProduct(data) {
  return request({
    url: '/storecheckdetail/queryCheckProductList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
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
