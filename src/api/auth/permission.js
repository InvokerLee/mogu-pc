import request from '@/utils/request/index';

export function getMenus() {
  return request({
    url: '/sys/menu/queryAll',
    method: 'post'
  });
}
export function delMenus(id) {
  return request({
    url: `/sys/menu/delete/${id}`,
    method: 'get'
  });
}

export function addMenu(data) {
  return request({
    url: '/sys/menu/save',
    method: 'post',
    data
  });
}

export function editMenu(data) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    data
  });
}
