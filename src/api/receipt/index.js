import request from '@/utils/request/index';

// 回单主表
export function receiptOrderList(data) {
  return request({
    url: '/receiptconfirmorder/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function receiptOrderCheck(data) {
  return request({
    url: '/receiptconfirmorder/check',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function receiptOrderAll(data) {
  return request({
    url: '/receiptconfirmorder/allReject',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
