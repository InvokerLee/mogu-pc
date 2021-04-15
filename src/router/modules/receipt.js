import Layout from '@/layout';

export default {
  path: '/receipt',
  name: 'receipt',
  component: Layout,
  meta: { title: '回单', icon: 'el-icon-tickets' },
  redirect: '/receipt/ticketCheck',
  children: [
    // 订单列表
    {
      path: 'ticketCheck',
      component: () => import('@/views/modules/receipt/ticketCheck'),
      name: 'ticketCheck',
      meta: { title: '回单确认' }
    }
  ]
};
