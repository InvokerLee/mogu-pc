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

export function getSaleSort(data) {
  return request({
    url: '/index/salesSort',
    method: 'post',
    data
  });
}
export function getStatistics(data) {
  return request({
    url: '/index/salesStatistics',
    method: 'post',
    data
  });
}
