const getters = {
  sidebar: state => state.app.sidebar,
  realname: state => state.user.userInfo.realname,
  menuList: state => state.user.userInfo.menuList,
  cachedViews: state => state.tagsView.cachedViews,
  routes: state => state.permission.routes,
  getConstByKey: state => (key) => {
    const g = state.app.consts[key];
    const obj = {};
    if (g) {
      obj.options = g;
      g.forEach((item) => { obj[item.value] = item.label; });
    }
    return obj;
  }
};
export default getters;
