import request from '@/utils/request';

// 采购英文备注模板
export function commonSelectType() {
  return request({
    url: '/common/selectType',
    method: 'post'
  });
}

