import request from '@/utils/request';

// 订单列表
export function orderIndex(params) {
  return request({
    url: '/order/index',
    method: 'get',
    params,
  });
}

export function orderDetail(id) {
  return request({
    url: `/order/${id}/detail`,
    method: 'get',
  });
}

export function orderCancel(id, data) {
  return request({
    url: `/order/${id}/cancel`,
    method: 'post',
    data,
  });
}

export function orderUpdatePayTime(id, data) {
  return request({
    url: `/order/${id}/updatePayTime`,
    method: 'post',
    data,
  });
}

export function addOrderRemark(id, data) {
  return request({
    url: `/order/${id}/addRemark`,
    method: 'post',
    data,
  });
}

export function getOrderEmail(id) {
  return request({
    url: `/order/${id}/email`,
    method: 'get',
  });
}

export function getOrderOff(id) {
  return request({
    url: `/order/${id}/off`,
    method: 'get',
  });
}

export function convertRmb(id) {
  return request({
    url: `/order/${id}/convertRmb`,
    method: 'post',
  });
}

export function lockConvert(id, data) {
  return request({
    url: `/order/${id}/lockConvert`,
    method: 'post',
    data,
  });
}

export function bomDownload(id) {
  return request({
    url: `/order/${id}/bomDown`,
    method: 'get',
    responseType: 'blob',
  });
}

export function getOrderPayType(id) {
  return request({
    url: `/order/${id}/modifyPayType`,
    method: 'get',
  });
}

export function updateOrderPayType(id, data) {
  return request({
    url: `/order/${id}/modifyPayType`,
    method: 'post',
    data,
  });
}

export function orderApplyFree(id, data) {
  return request({
    url: `/order/${id}/free`,
    method: 'post',
    data,
  });
}

export function updateExpectedDelivery(id, data) {
  return request({
    url: `/order/${id}/updateExpectedDelivery`,
    method: 'post',
    data,
  });
}

export function deliveryIntercept(id, data) {
  return request({
    url: `/order/${id}/deliveryIntercept`,
    method: 'post',
    data,
  });
}

export function cancelDeliveryIntercept(id) {
  return request({
    url: `/order/${id}/cancelDeliveryIntercept`,
    method: 'post',
  });
}

export function getCanBindOrders(id) {
  return request({
    url: `/order/${id}/canBindDeliveryOrders`,
    method: 'get',
  });
}

export function getContinuationCost(id, params) {
  return request({
    url: `/order/${id}/continuationCost`,
    method: 'get',
    params,
  });
}

export function bindDelivery(id, data) {
  return request({
    url: `/order/${id}/bindDelivery`,
    method: 'post',
    data,
  });
}

export function getCancelBindData(id) {
  return request({
    url: `/order/${id}/cancelBindDeliveryData`,
    method: 'get',
  });
}

export function cancelBindDelivery(id, data) {
  return request({
    url: `/order/${id}/cancelBindDelivery
    `,
    method: 'post',
    data,
  });
}

export function getOrderCompany(id, params) {
  return request({
    url: `/order/${id}/company`,
    method: 'get',
    params,
  });
}

export function productQuantityInit(id, params) {
  return request({
    url: `/order/${id}/products/change`,
    method: 'get',
    params,
  });
}

export function updateProductQuantity(id, data) {
  return request({
    url: `/order/${id}/products/change`,
    method: 'post',
    data,
  });
}

export function supplyApply(id, data) {
  return request({
    url: `/order/${id}/supply/apply`,
    method: 'post',
    data,
  });
}

export function refundApply(id, data) {
  return request({
    url: `/order/${id}/refund/apply`,
    method: 'post',
    data,
  });
}

export function canRefundInfo(id) {
  return request({
    url: `/order/${id}/refund/apply`,
    method: 'get',
  });
}

// 订货单列表
export function orderInquiryList(params) {
  return request({
    url: '/order/inquiry/getOrderList',
    method: 'get',
    params,
  });
}

export function inquiryList(szlcsc_no) {
  return request({
    url: `/order/inquiry/${szlcsc_no}/list`,
    method: 'get',
  });
}

export function inquiryConfirmOrder(szlcsc_no) {
  return request({
    url: `/order/inquiry/${szlcsc_no}/confirmOrder`,
    method: 'post',
  });
}

export function inquiryRecordTranslate(id, data) {
  return request({
    url: `/order/inquiry/record/${id}/translate`,
    method: 'post',
    data,
  });
}

export function inquirySetExpireDate(id, data) {
  return request({
    url: `/order/inquiry/${id}/setExpireDate`,
    method: 'post',
    data,
  });
}

// 线下汇款列表
export function getOrderTransfer(params) {
  return request({
    url: '/order/transfer/index',
    method: 'get',
    params,
  });
}

export function transferReceiptCreate(params) {
  return request({
    url: '/transfer/receipt/create',
    method: 'get',
    params,
  });
}

export function transferReceiptOrderAdd(data) {
  return request({
    url: '/transfer/receipt/order/add',
    method: 'post',
    data,
  });
}

export function transferReceiptStore(data) {
  return request({
    url: '/transfer/receipt/store',
    method: 'post',
    data,
  });
}

export function orderMarkPay(id, data) {
  return request({
    url: `order/${id}/markPay`,
    method: 'post',
    data,
  });
}

// 退款申请列表
export function getRefundApplyList(params) {
  return request({
    url: '/order/refund/apply/index',
    method: 'get',
    params,
  });
}

export function refundApplyAudit(id, data) {
  return request({
    url: `/order/refund/apply/${id}/audit`,
    method: 'post',
    data,
  });
}

// 免单列表
export function getFreeReceipts(params) {
  return request({
    url: '/order/frees',
    method: 'get',
    params,
  });
}

export function freeReview(id, data) {
  return request({
    url: `/order/${id}/freeReview`,
    method: 'post',
    data,
  });
}

// 退货列表
export function getReturnList(params) {
  return request({
    url: '/order/backgood/apply/index',
    method: 'get',
    params,
  });
}

export function backgoodApplayInitData(id) {
  return request({
    url: `/order/${id}/backgood/apply`,
    method: 'get',
  });
}

// 挂单列表
export function getDelaysList(params) {
  return request({
    url: '/order/delays',
    method: 'get',
    params,
  });
}

export function markAsking(id) {
  return request({
    url: `/order/delays/${id}/markAskIng`,
    method: 'post',
  });
}

export function markAskEnd(id, data) {
  return request({
    url: `/order/delays/${id}/markAskEnd`,
    method: 'post',
    data,
  });
}

// 补款申请列表
export function getSupplyApplyList(params) {
  return request({
    url: '/order/supply/apply/index',
    method: 'get',
    params,
  });
}

export function supplyApplyAudit(id, data) {
  return request({
    url: `/order/supply/apply/${id}/audit`,
    method: 'post',
    data,
  });
}

// 补发商品列表
export function getSupplyProducts(params) {
  return request({
    url: '/order/supply/product/index',
    method: 'get',
    params,
  });
}

export function forbidSupplyProduct(data) {
  return request({
    url: '/order/supply/product/failed',
    method: 'post',
    data,
  });
}

export function getOrderCreateInfo(params) {
  return request({
    url: '/order/supply/product/order/create',
    method: 'get',
    params,
  });
}

export function getExpressFreighttest(params) {
  return request({
    url: '/express/freighttest',
    method: 'get',
    params,
  });
}

export function generateOrder(data) {
  return request({
    url: '/order/supply/product/order/store',
    method: 'post',
    data,
  });
}
