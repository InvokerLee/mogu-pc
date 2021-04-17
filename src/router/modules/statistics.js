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
    },
    {
      path: 'saleData',
      component: () => import('@/views/modules/statistics/saleData'),
      name: 'saleData',
      meta: { title: '销售数据' },
      redirect: '/statistics/saleData/cus',
      children: [
        {
          path: 'cus',
          component: () => import('@/views/modules/statistics/saleData/cus'),
          name: 'cus',
          meta: { title: '客户销售数据' }
        },
        {
          path: 'goods',
          component: () => import('@/views/modules/statistics/saleData/goods'),
          name: 'goods',
          meta: { title: '产品销售数据' }
        },
        {
          path: 'cusAndGoods',
          component: () => import('@/views/modules/statistics/saleData/cusAndGoods'),
          name: 'cusAndGoods',
          meta: { title: '客户产品销售汇总' }
        },
        {
          path: 'saleman',
          component: () => import('@/views/modules/statistics/saleData/saleman'),
          name: 'saleman',
          meta: { title: '业务员报表' }
        }
      ]
    }
  ]
};
