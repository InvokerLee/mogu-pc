import request from '@/utils/request';

// 发货列表
export function getDeliveryList(params = {}) {
  return request({
    url: '/order/batches',
    method: 'get',
    params,
  });
}

// 修改物流单号
export function updateTrackingNumber(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateTrackingNumber`,
    method: 'post',
    data,
  });
}

// 修改申报金额
export function updateDeclareAmount(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateDeclareAmount`,
    method: 'post',
    data,
  });
}

// 购买保险
export function insurance(id, data = {}) {
  return request({
    url: `/order/batches/${id}/insurance`,
    method: 'post',
    data,
  });
}

// 发货单详情
export function getDeliveryDetail(id, params = {}) {
  return request({
    url: `/order/batches/${id}`,
    method: 'get',
    params,
  });
}

// 修改预报单号
export function updateAlertNumber(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateAlertNumber`,
    method: 'post',
    data,
  });
}

// 填写中文地址
export function cnAddress(id, data = {}) {
  return request({
    url: `/order/batches/${id}/cnAddress`,
    method: 'post',
    data,
  });
}

// 获取件数称重信息
export function weightInfo(id, params = {}) {
  return request({
    url: `/order/batches/${id}/weightInfo`,
    method: 'get',
    params,
  });
}

// 修改件数称重
export function updateWeight(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateWeight`,
    method: 'post',
    data,
  });
}

// 修改地址
export function updateAddress(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateAddress`,
    method: 'post',
    data,
  });
}

// 获取国家信息
export function getCountries(params = {}) {
  return request({
    url: '/order/countries',
    method: 'get',
    params,
  });
}

// 获取物流渠道
export function getExpressChannel(id, params = {}) {
  return request({
    url: `/order/batches/${id}/getExpressChannel`,
    method: 'get',
    params,
  });
}

// 修改物流渠道
export function updateExpressChannel(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateExpressChannel`,
    method: 'post',
    data,
  });
}

// 待处理异常单列表
export function getAbnormalList(params = {}) {
  return request({
    url: '/order/abnormal',
    method: 'get',
    params,
  });
}

// 待处理异常单列表 - 标记已处理
export function markHandle(id, data = {}) {
  return request({
    url: `/order/abnormal/${id}/markHandle`,
    method: 'post',
    data,
  });
}

// 待入库外贸记录列表
export function warehouseRecords(params = {}) {
  return request({
    url: '/order/abnormal/warehouseRecords',
    method: 'get',
    params,
  });
}

// 待入库外贸记录 - 标记已入库
export function markWarehouse(id, data = {}) {
  return request({
    url: `/order/abnormal/warehouseRecords/${id}/markWarehouse`,
    method: 'post',
    data,
  });
}

// 待退回国内记录列表
export function getReturnRecordsList(params = {}) {
  return request({
    url: '/order/abnormal/returnRecords',
    method: 'get',
    params,
  });
}

// 待退回国内记录 - 标记已退回
export function markReturn(id, data = {}) {
  return request({
    url: `/order/abnormal/returnRecords/${id}/markReturn`,
    method: 'post',
    data,
  });
}

// 预报
export function shipmentAlert(data = {}) {
  return request({
    url: `/shipment/alert`,
    method: 'post',
    data,
  });
}

// 生成报关单据
export function createDeclaration(data = {}) {
  return request({
    url: `/order/batches/createDeclaration`,
    method: 'post',
    data,
  });
}

// 装箱单
export function getPackingList(id, params = {}) {
  return request({
    url: `/order/batches/${id}/packingList`,
    method: 'get',
    params,
  });
}

// 修改装箱单
export function updatePackingList(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updatePackingList`,
    method: 'post',
    data,
  });
}

// 随货发票
export function getCommercialInvoice(id, params = {}) {
  return request({
    url: `/order/batches/${id}/commercialInvoice`,
    method: 'get',
    params,
  });
}

// 修改随货发票
export function updateCommercialInvoice(id, data = {}) {
  return request({
    url: `/order/batches/${id}/updateCommercialInvoice`,
    method: 'post',
    data,
  });
}

// 撤销预报
export function cancelAlert(id, data = {}) {
  return request({
    url: `/shipment/${id}/cancelAlert`,
    method: 'post',
    data,
  });
}
