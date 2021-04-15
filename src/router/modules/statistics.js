import Layout from '@/layout';

export default {
  path: '/statistics',
  name: 'statistics',
  component: Layout,
  meta: { title: '统计', icon: 'el-icon-s-data' },
  redirect: '/statistics/purchase',
  children: [
    // 订单列表
    {
      path: 'purchase',
      component: () => import('@/views/modules/statistics/purchase'),
      name: 'purchase',
      meta: { title: '采购数据' }
    }
  ]
};
