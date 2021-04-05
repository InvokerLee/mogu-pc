import request from '@/utils/request';

export function getHomeData() {
  return request({
    url: '/home/welcome',
    method: 'get',
  });
}

export function getPieData() {
  return request({
    url: '/crm/inside-work-order/demand/statistics',
    method: 'get',
  });
}

export function cacheClear() {
  return request({
    url: '/home/cacheClear',
    method: 'patch',
  });
}
