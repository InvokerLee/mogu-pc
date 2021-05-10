import request from '@/utils/request';

export function currentDayData() {
  return request({
    url: '/index/currentDay',
    method: 'get'
  });
}

export function orderCount() {
  return request({
    url: '/index/orderCount',
    method: 'get'
  });
}
export function exceptionMonitor() {
  return request({
    url: '/index/exceptionMonitor',
    method: 'get'
  });
}

export function getPieData() {
  return request({
    url: '/crm/inside-work-order/demand/statistics',
    method: 'get'
  });
}

export function cacheClear() {
  return request({
    url: '/home/cacheClear',
    method: 'patch'
  });
}
