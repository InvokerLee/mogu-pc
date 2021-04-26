import request from '@/utils/request';

// 公司
export function companyInfoList(data) {
  return request({
    url: '/companyinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addCompany(data) {
  return request({
    url: '/companyinfo/save',
    method: 'post',
    data
  });
}
export function editCompany(data) {
  return request({
    url: '/companyinfo/update',
    method: 'post',
    data
  });
}
export function delCompany(id) {
  return request({
    url: `/companyinfo/delete/${id}`,
    method: 'get'
  });
}

// 产品
export function productList(data) {
  return request({
    url: '/productinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addProduct(data) {
  return request({
    url: '/productinfo/save',
    method: 'post',
    data
  });
}
export function editProduct(data) {
  return request({
    url: '/productinfo/update',
    method: 'post',
    data
  });
}
export function delProduct(id) {
  return request({
    url: `/productinfo/delete/${id}`,
    method: 'get'
  });
}
export function productSafeStoreList(data) {
  return request({
    url: '/productsafestore/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addSafeStore(data) {
  return request({
    url: '/productsafestore/save',
    method: 'post',
    data
  });
}
export function editSafeStore(data) {
  return request({
    url: '/productsafestore/update',
    method: 'post',
    data
  });
}
export function delSafeStore(id) {
  return request({
    url: `/productsafestore/delete/${id}`,
    method: 'get'
  });
}

// 客户
export function guestInfoList(data) {
  return request({
    url: '/guestinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function guestInfoDetailList(data) {
  return request({
    url: '/guestinfo/detail/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addGuest(data) {
  return request({
    url: '/guestinfo/save',
    method: 'post',
    data
  });
}
export function addGuestDetail(data) {
  return request({
    url: '/guestinfo/detail/save',
    method: 'post',
    data
  });
}
export function editGuestDetail(data) {
  return request({
    url: '/guestinfo/detail/update',
    method: 'post',
    data
  });
}
export function editGuest(data) {
  return request({
    url: '/guestinfo/update',
    method: 'post',
    data
  });
}

// 批号
export function batchInfoList(data) {
  return request({
    url: '/batchinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addBatch(data) {
  return request({
    url: '/batchinfo/save',
    method: 'post',
    data
  });
}
export function editBatch(data) {
  return request({
    url: '/batchinfo/update',
    method: 'post',
    data
  });
}
export function delBatch(id) {
  return request({
    url: `/batchinfo/delete/${id}`,
    method: 'get'
  });
}

// 供应商
export function providerInfoList(data) {
  return request({
    url: '/providerinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addProvider(data) {
  return request({
    url: '/providerinfo/save',
    method: 'post',
    data
  });
}
export function editProvider(data) {
  return request({
    url: '/providerinfo/update',
    method: 'post',
    data
  });
}
export function delProvider(id) {
  return request({
    url: `/providerinfo/delete/${id}`,
    method: 'get'
  });
}

// 仓库
export function storeInfoList(data) {
  return request({
    url: '/storeinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addStore(data) {
  return request({
    url: '/storeinfo/save',
    method: 'post',
    data
  });
}
export function editStore(data) {
  return request({
    url: '/storeinfo/update',
    method: 'post',
    data
  });
}
export function delStore(id) {
  return request({
    url: `/storeinfo/delete/${id}`,
    method: 'get'
  });
}

// 类别
export function typeInfoList(data) {
  return request({
    url: '/typeinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addType(data) {
  return request({
    url: '/typeinfo/save',
    method: 'post',
    data
  });
}
export function editType(data) {
  return request({
    url: '/typeinfo/update',
    method: 'post',
    data
  });
}
export function delType(id) {
  return request({
    url: `/typeinfo/delete/${id}`,
    method: 'get'
  });
}

// 品牌
export function brandInfoList(data) {
  return request({
    url: '/brandinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addBrand(data) {
  return request({
    url: '/brandinfo/save',
    method: 'post',
    data
  });
}
export function editBrand(data) {
  return request({
    url: '/brandinfo/update',
    method: 'post',
    data
  });
}
export function delBrand(id) {
  return request({
    url: `/brandinfo/delete/${id}`,
    method: 'get'
  });
}

// 职员
export function staffInfoList(data) {
  return request({
    url: '/staffinfo/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export function addStaff(data) {
  return request({
    url: '/staffinfo/save',
    method: 'post',
    data
  });
}
export function editStaff(data) {
  return request({
    url: '/staffinfo/update',
    method: 'post',
    data
  });
}
export function delStaff(id) {
  return request({
    url: `/staffinfo/delete/${id}`,
    method: 'get'
  });
}
