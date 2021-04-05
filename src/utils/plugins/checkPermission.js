import store from '@/store';

export default {
  install(Vue) {
    Vue.prototype.$hasPermission = function(value) {
      const menuList = store.getters && store.getters.menuList;
      const permisionArr = [];

      if (typeof value === 'string') {
        permisionArr.push(value);
      }

      if (value instanceof Array) {
        permisionArr.concat(value);
      }

      if (!permisionArr.length) return false;

      const hasPermission = permisionArr.every(permissionKey => {
        return menuList.some(v => v.route === permissionKey);
      });

      if (!hasPermission) return false;

      const item = menuList.find(v => v.route === permisionArr[0]);
      return item.name;
    };
  }
};
