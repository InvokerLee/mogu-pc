import request from '@/utils/request/index';

// 采购数据
export function reportStockProvider(data) {
  return request({
    url: '/report/stock/provider',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function reportStockProduct(data) {
  return request({
    url: '/report/stock/product',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function reportStockDetail(data) {
  return request({
    url: '/report/stockDetail',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 销售
export function reportSalesGuest(data) {
  return request({
    url: '/report/salesGuest',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function reportSalesProduct(data) {
  return request({
    url: '/report/sales/product',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function reportSalesGuestAndProductOfHeader(data) {
  return request({
    url: '/report/sales/guestAndProductOfHeader',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function reportSalesGuestAndProductOfShop(data) {
  return request({
    url: '/report/sales/guestAndProductOfShop',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function reportSalesBizMan(data) {
  return request({
    url: '/report/sales/bizMan',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 出入库记录
export function reportInstockAndOutStock(data) {
  return request({
    url: '/report/storeInAndStoreOut',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 畅销滞销
export function reportSalableAndUnsalable(data) {
  return request({
    url: '/report/salableAndUnsalable',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 客户异常
export function reportProductGrossProfit(data) {
  return request({
    url: '/report/productGrossProfit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 订单异常
export function reportOrderGrossProfit(data) {
  return request({
    url: '/report/orderGrossProfit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 客户异常
export function reportGuestGrossProfit(data) {
  return request({
    url: '/report/guestGrossProfit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 安全库存
export function reportSafeStoreException(data) {
  return request({
    url: '/report/safeStoreException',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 库龄库存
export function reportAgeException(data) {
  return request({
    url: '/report/storeAgeException',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

// 订单缺货率
export function reportOrderOutageRate(data) {
  return request({
    url: '/report/orderOutageRate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
