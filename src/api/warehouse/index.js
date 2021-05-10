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
