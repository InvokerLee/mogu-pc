import Layout from '@/layout';

const auth = {
  path: '/auth',
  name: 'auth',
  component: Layout,
  meta: { title: '权限系统', icon: 'el-icon-setting' },
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
      path: 'assign-permission',
      name: 'assign-permission',
      component: () => import('@/views/modules/auth/assign-permission'),
      hidden: true,
      meta: { title: '授权功能' }
    },
    {
      path: 'resource',
      name: 'resource',
      component: () => import('@/views/modules/auth/resource'),
      meta: { title: '资源管理' }
    },
    {
      path: 'permission',
      name: 'permission',
      component: () => import('@/views/modules/auth/permission'),
      meta: { title: '功能管理' }
    }
  ]
};

export default auth;
