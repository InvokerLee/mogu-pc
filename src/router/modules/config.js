import Layout from '@/layout';

export default {
  path: '/config',
  name: 'config',
  component: Layout,
  meta: { title: '配置', icon: 'el-icon-document' },
  redirect: '/config/employeeList',
  children: [
    // 订单列表
    {
      path: 'employeeList',
      component: () => import('@/views/modules/config/employeeList'),
      name: 'employeeList',
      meta: { title: '职员信息' }
    }
  ]
};
