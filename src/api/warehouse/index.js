import request from '@/utils/request/index';

// 回单主表
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
