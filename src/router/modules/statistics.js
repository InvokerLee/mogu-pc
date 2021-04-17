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
    },
    {
      path: 'stockChangeHistory',
      component: () => import('@/views/modules/statistics/stockChangeHistory'),
      name: 'stockChangeHistory',
      meta: { title: '出入库记录' }
    },
    {
      path: 'salesRank',
      component: () => import('@/views/modules/statistics/salesRank'),
      name: 'salesRank',
      meta: { title: '畅销/滞销排行' }
    },
    {
      path: 'goodsGrossProfit',
      component: () => import('@/views/modules/statistics/goodsGrossProfit'),
      name: 'goodsGrossProfit',
      meta: { title: '产品毛利异常' }
    }
  ]
};
