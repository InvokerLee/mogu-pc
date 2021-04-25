import Layout from '@/layout';

export default {
  path: '/warehouse',
  name: 'warehouse',
  component: Layout,
  meta: { title: '仓储', icon: 'el-icon-office-building' },
  redirect: '/warehouse/stock',
  children: [
    {
      path: 'stock',
      component: () => import('@/views/modules/warehouse/stock'),
      name: 'stock',
      meta: { title: '库存' }
    }
  ]
};