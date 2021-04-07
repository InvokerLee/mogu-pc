import router from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/cookie'; // get token from cookie
import store from './store';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login'];

const reLogin = (to, next) => {
  store.dispatch('user/resetAll');
  next(`/login?redirect=${to.path}`);
  NProgress.done();
};

router.beforeEach(async(to, from, next) => {
  NProgress.start();

  const hasToken = getToken();
  if (!hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasMenus = store.state.permission.routes && store.state.permission.routes.length > 0;
      if (hasMenus) {
        next();
      } else {
        try {
          // const permissionList = await store.dispatch('user/getUserInfo');
          // const accessRoutes = await store.dispatch('permission/generateRoutes', permissionList);
          const accessRoutes = await store.dispatch('permission/generateRoutes', []);

          router.addRoutes(accessRoutes);
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
        } catch (e) {
          reLogin(to, next);
        }
      }
    }
  } else if (whiteList.indexOf(to.path) !== -1) { // 在白名单内，直接访问
    next();
  } else {
    reLogin(to, next); // 重新登录
  }
});

router.afterEach(() => {
  NProgress.done();
});
