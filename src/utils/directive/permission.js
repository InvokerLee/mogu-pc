/**
 * 根据权限判断是否显示组件
 * （不够灵活暂时弃用）
 */
import store from '@/store';

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const menuList = store.getters && store.getters.menuList;

    const permisionArr = [];

    if (typeof value === 'string') {
      permisionArr.push(value);
    }

    if (value instanceof Array) {
      permisionArr.concat(value);
    }

    if (permisionArr.length > 0) {
      const hasPermission = permisionArr.every(permissionKey => {
        return menuList.some(v => v.route === permissionKey);
      });

      if (permisionArr.length === 1) {
        const item = menuList.find(v => v.route === permisionArr[0]);
        el.innerText = item && item.name;
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need roles! Like v-permission="'add' or ['add','edit']"`);
    }
  },
};
