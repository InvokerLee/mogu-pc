import request from '@/utils/request';

// 采购英文备注模板
export function commonCompanyList() {
  return request({
    url: '/common/selectCompany',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

