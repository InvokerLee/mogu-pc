import Layout from '@/layout';

export default {
  path: '/statistics',
  name: 'statistics',
  component: Layout,
  meta: { title: '统计', icon: 'el-icon-s-data' },
  redirect: '/statistics/purchase',
  children: [
    {
      path: 'purchase',
      component: () => import('@/views/modules/statistics/purchase'),
      name: 'purchase',
      meta: { title: '采购数据' }
    },
    {
      path: 'purchaseDetail',
      component: () => import('@/views/modules/statistics/purchaseDetail'),
      name: 'purchaseDetail',
      meta: { title: '采购明细表' }
    }
  ]
};
