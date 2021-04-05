import request from '@/utils/request';

export function scanSubmit(data) {
  return request({
    url: '/shipment/scan/submit',
    method: 'post',
    data,
  });
}

export function scanReset() {
  return request({
    url: '/shipment/scan/reset',
    method: 'post',
  });
}

export function updateScanWeight(data) {
  return request({
    url: '/shipment/scan/weightUpdate',
    method: 'post',
    data,
  });
}

export function scanWeightInfo() {
  return request({
    url: '/shipment/scan/getWeighInfo',
    method: 'get',
  });
}
