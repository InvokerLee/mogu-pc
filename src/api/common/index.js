import request from '@/utils/request';

//
export function commonCompanyList() {
  return request({
    url: '/common/selectCompany',
    method: 'post'
  });
}
export function commonSelectType() {
  return request({
    url: '/common/selectType',
    method: 'post'
  });
}
export function commonSelectBrand() {
  return request({
    url: '/common/selectBrand',
    method: 'post'
  });
}
export function commonSelectStore() {
  return request({
    url: '/common/selectStoreInfo',
    method: 'post'
  });
}
export function commonStaff(data) {
  return request({
    url: '/common/staff',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function commonSelectGuest(data) {
  return request({
    url: '/common/selectGuest',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function commonSelectProduct(data) {
  return request({
    url: '/common/selectProduct',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
