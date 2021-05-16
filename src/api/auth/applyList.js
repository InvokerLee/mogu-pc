import request from '@/utils/request/index';

export function getApplyList(data) {
  return request({
    url: '/apply/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function applySave(data) {
  return request({
    url: '/apply/save',
    method: 'post',
    data
  });
}

export function auditPass(id) {
  return request({
    url: `/apply/auditPass/${id}`,
    method: 'get'
  });
}

export function reject(id) {
  return request({
    url: `/apply/reject/${id}`,
    method: 'get'
  });
}
