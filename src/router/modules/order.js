import Layout from '@/layout';

const order = {
  path: '/order',
  name: 'order',
  component: Layout,
  meta: { title: '订单管理', icon: 'el-icon-s-order' },
  redirect: '/order/orderList',
  children: [
    // 订单列表
    {
      path: 'orderList',
      component: () => import('@/views/modules/order/orderList'),
      name: 'orderList',
      meta: { title: '订单列表' }
    },
    {
      path: 'orderDetail',
      component: () => import('@/views/modules/order/orderDetail'),
      name: 'orderDetail',
      hidden: true,
      meta: { title: '订单详情', noCache: true }
    },
    // 订货订单列表
    {
      path: 'bookingOrder',
      component: () => import('@/views/modules/order/bookingOrder'),
      name: 'bookingOrder',
      meta: { title: '订货订单列表' }
    },
    {
      path: 'enquiryPrice',
      component: () => import('@/views/modules/order/enquiryPrice'),
      name: 'enquiryPrice',
      hidden: true,
      meta: { title: '询价信息' }
    },
    // 线下汇款订单
    {
      path: 'offlineRemittance',
      component: () => import('@/views/modules/order/offlineRemittance'),
      name: 'offlineRemittance',
      meta: { title: '线下汇款订单' }
    },
    {
      path: 'addRemittance',
      component: () => import('@/views/modules/order/addRemittance'),
      name: 'addRemittance',
      hidden: true,
      meta: { title: '新增收款单' }
    },
    // 补发商品列表
    {
      path: 'reissueProducts',
      component: () => import('@/views/modules/order/reissueProducts'),
      name: 'reissueProducts',
      meta: { title: '补发商品列表' }
    },
    {
      path: 'addReissueOrder',
      component: () => import('@/views/modules/order/addReissueOrder'),
      name: 'addReissueOrder',
      hidden: true,
      meta: { title: '生成补发订单' }
    },
    // 免单列表
    {
      path: 'freeReceipt',
      component: () => import('@/views/modules/order/freeReceipt'),
      name: 'freeReceipt',
      meta: { title: '免单列表' }
    },
    // 退货列表
    {
      path: 'returnList',
      component: () => import('@/views/modules/order/returnList'),
      name: 'returnList',
      meta: { title: '退货列表' }
    },
    {
      path: 'applyReturn',
      component: () => import('@/views/modules/order/applyReturn'),
      name: 'applyReturn',
      hidden: true,
      meta: { title: '申请退货', noCache: true }
    },
    // 退款列表
    {
      path: 'refundList',
      component: () => import('@/views/modules/order/refundList'),
      name: 'refundList',
      meta: { title: '退款申请列表' }
    },
    // 补款列表
    {
      path: 'fillMoneyList',
      component: () => import('@/views/modules/order/fillMoneyList'),
      name: 'fillMoneyList',
      meta: { title: '补款列表' }
    },
    // 挂单列表
    {
      path: 'pendingOrderList',
      component: () => import('@/views/modules/order/pendingOrderList'),
      name: 'pendingOrderList',
      meta: { title: '挂单列表' }
    }
  ]
};

export default order;
