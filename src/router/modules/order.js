import Layout from '@/layout';

export default {
  path: '/order',
  name: 'order',
  component: Layout,
  meta: { title: '订单', icon: 'el-icon-s-order' },
  redirect: '/receipt/ticketCheck',
  children: [
    // 订单列表
    {
      path: 'orderList',
      component: () => import('@/views/modules/order/orderList'),
      name: 'orderList',
      meta: { title: '订单列表' }
    }
  ]
};
