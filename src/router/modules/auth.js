import Layout from '@/layout';

const auth = {
  path: '/auth',
  name: 'auth',
  component: Layout,
  meta: { title: '系统', icon: 'el-icon-user' },
  redirect: '/auth/user',
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/modules/auth/user'),
      meta: { title: '用户管理' }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/modules/auth/role'),
      meta: { title: '角色管理' }
    },
    {
      path: 'permission',
      name: 'permission',
      component: () => import('@/views/modules/auth/permission'),
      meta: { title: '菜单管理' }
    },
    {
      path: 'sysSet',
      name: 'sysSet',
      component: () => import('@/views/modules/auth/sysSet'),
      meta: { title: '系统配置项' }
    },
    {
      path: 'applyList',
      name: 'applyList',
      component: () => import('@/views/modules/auth/applyList'),
      meta: { title: '申请列表' }
    }
  ]
};

export default auth;
