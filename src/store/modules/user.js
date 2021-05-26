import { login, logout } from '@/api/login';
import { getLoginUser } from '@/api/auth/user';

import { removeToken } from '@/utils/cookie';

const getDefaultState = () => {
  return {
    userInfo: { // 用户信息
      realname: '',
      phone: '',
      sysMenuList: []
    }
  };
};

const state = getDefaultState();

const mutations = {
  RESET_USER_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_USER_INFO: (state, user_info) => {
    Object.keys(state.userInfo).forEach((key) => {
      state.userInfo[key] = user_info[key];
    });
  }
};

const actions = {
  // 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  // 登出
  logout({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        dispatch('resetAll');
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getLoginUser().then((data) => {
        commit('SET_USER_INFO', data.result);
        resolve(data.result.sysMenuList);
      }).catch(error => {
        reject(error);
      });
    });
  },
  // reset
  resetAll({ commit, state }) {
    commit('RESET_USER_STATE'); // 清除用户信息
    commit('permission/SET_EMPTY_ROUTES', [], { root: true }); // 清除路由信息
    removeToken(); // 清除Token
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

