import request from '@/utils/request';

// 退款记录列表
export function getRefundRecordList(params = {}) {
  return request({
    url: '/payment/refund/index',
    method: 'get',
    params,
  });
}

// 支付记录列表
export function paymentRecordsList(params = {}) {
  return request({
    url: '/order/payment/records/index',
    method: 'get',
    params,
  });
}

// 汇款订单收款记录
export function paymentTransferList(params = {}) {
  return request({
    url: '/payment/transfer/index',
    method: 'get',
    params,
  });
}

// 收款单详情
export function getReceiptDetail(id, params = {}) {
  return request({
    url: `/transfer/receipt/edit/${id}`,
    method: 'get',
    params,
  });
}

// 修改收款单
export function updateReceiptDetail(id, data = {}) {
  return request({
    url: `/payment/transfer/update/${id}`,
    method: 'post',
    data,
  });
}

// 修改汇款单状态
export function changeReceiptDetail(id, data = {}) {
  return request({
    url: `/payment/transfer/status/change/${id}`,
    method: 'post',
    data,
  });
}

// 新增关联订单
export function addOrderTransfer(data = {}) {
  return request({
    url: '/payment/transfer/order/add',
    method: 'post',
    data,
  });
}

// 退款账户记录
export function getRefundAccountRecord(params = {}) {
  return request({
    url: '/payment/refund/index',
    method: 'get',
    params,
  });
}
