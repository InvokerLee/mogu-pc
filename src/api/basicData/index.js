import request from '@/utils/request';

// 采购英文备注模板
export function inquiryTranslation() {
  return request({
    url: '/order/inquiry/translation',
    method: 'get',
  });
}

export function inquiryTranslationAdd(data) {
  return request({
    url: '/order/inquiry/translation',
    method: 'post',
    data,
  });
}

export function inquiryTranslationUpdate(id, data) {
  return request({
    url: `/order/inquiry/translation/${id}`,
    method: 'post',
    data,
  });
}

export function inquiryTranslationDelete(id) {
  return request({
    url: `/order/inquiry/translation/${id}/delete`,
    method: 'post',
  });
}

// 常用备注模板
export function getOrderRemarkTemplate(params) {
  return request({
    url: '/order/remarkTemplates',
    method: 'get',
    params,
  });
}

export function addOrderRemarkTemplate(data) {
  return request({
    url: '/order/remarkTemplates',
    method: 'post',
    data,
  });
}

export function updateOrderRemarkTemplate(id, data) {
  return request({
    url: `/order/remarkTemplates/${id}/update`,
    method: 'post',
    data,
  });
}

export function delOrderRemarkTemplate(id) {
  return request({
    url: `/order/remarkTemplates/${id}/delete`,
    method: 'post',
  });
}

// 人民币换算
export function getOrderConvertRmbRate(params) {
  return request({
    url: '/order/convertRmbRate',
    method: 'get',
    params,
  });
}

export function updateConvertRmbRate(data) {
  return request({
    url: '/order/convertRmbRate',
    method: 'post',
    data,
  });
}

