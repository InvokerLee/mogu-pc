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
