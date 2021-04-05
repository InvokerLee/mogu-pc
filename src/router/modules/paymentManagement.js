/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout';

const paymentManagement = {
  path: '/paymentManagement',
  name: 'paymentManagement',
  component: Layout,
  redirect: '/paymentManagement/deliveryList',
  meta: { title: '支付管理', icon: 'el-icon-s-finance' },
  children: [
    // 线下汇款订单收款
    {
      path: 'remitOrderIncomeList',
      component: () => import('@/views/modules/paymentManagement/remitOrderIncomeList'),
      name: 'remitOrderIncomeList',
      meta: { title: '线下汇款订单收款' },
    },
    // 月结账单列表
    {
      path: 'monthlyBillList',
      component: () => import('@/views/modules/paymentManagement/monthlyBillList'),
      name: 'monthlyBillList',
      meta: { title: '月结账单列表' },
    },
    // 月结收款记录列表
    {
      path: 'monthlyPayList',
      component: () => import('@/views/modules/paymentManagement/monthlyPayList'),
      name: 'monthlyPayList',
      meta: { title: '月结收款记录列表' },
    },
    // 退款记录列表
    {
      path: 'refundRecordList',
      component: () => import('@/views/modules/paymentManagement/refundRecordList'),
      name: 'refundRecordList',
      meta: { title: '退款记录列表' },
    },
    // 支付记录列表
    {
      path: 'payList',
      component: () => import('@/views/modules/paymentManagement/payList'),
      name: 'payList',
      meta: { title: '支付记录列表' },
    },
    // 收款单详情
    {
      path: 'receiptDetail',
      component: () => import('@/views/modules/paymentManagement/receiptDetail'),
      name: 'receiptDetail',
      hidden: true,
      meta: { title: '收款单详情', noCache: true },
    },
    // 退款账户记录
    {
      path: 'refundAccountRecord',
      component: () => import('@/views/modules/paymentManagement/refundAccountRecord'),
      name: 'refundAccountRecord',
      meta: { title: '退款账户记录' },
    },
  ],
};

export default paymentManagement;
