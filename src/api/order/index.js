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
export function delOrder(data) {
  return request({
    url: `/orderinfo/delete`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function checkOrder(data) {
  return request({
    url: `/orderinfo/check`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 明细
export function getOrderDetailList(data) {
  return request({
    url: '/orderproductdetail/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function addOrderDetail(data) {
  return request({
    url: '/orderproductdetail/save',
    method: 'post',
    data
  });
}
export function editOrderDetail(data) {
  return request({
    url: '/orderproductdetail/update',
    method: 'post',
    data
  });
}
export function delOrderDetail(data) {
  return request({
    url: `/orderproductdetail/delete`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
