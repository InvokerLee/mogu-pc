/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout';

const deliveryManagement = {
  path: '/deliveryManagement',
  name: 'deliveryManagement',
  component: Layout,
  meta: { title: '发货管理', icon: 'el-icon-s-cooperation' },
  redirect: '/deliveryManagement/deliveryList',
  children: [
    // 扫描分拣
    {
      path: 'scanSorting',
      component: () => import('@/views/modules/deliveryManagement/scanSorting'),
      name: 'scanSorting',
      meta: { title: '扫描分拣' },
    },
    // 发货列表
    {
      path: 'deliveryList',
      component: () => import('@/views/modules/deliveryManagement/deliveryList'),
      name: 'deliveryList',
      meta: { title: '发货列表' },
    },
    // 待处理异常单
    {
      path: 'pendingExceptionOrder',
      component: () => import('@/views/modules/deliveryManagement/pendingExceptionOrder'),
      name: 'pendingExceptionOrder',
      meta: { title: '待处理异常单' },
    },
    // 待入库外贸记录
    {
      path: 'pendingStorageRecords',
      component: () => import('@/views/modules/deliveryManagement/pendingStorageRecords'),
      name: 'pendingStorageRecords',
      meta: { title: '待入库外贸记录' },
    },
    // 待退回国内记录
    {
      path: 'toReturnDomesticRecords',
      component: () => import('@/views/modules/deliveryManagement/toReturnDomesticRecords'),
      name: 'toReturnDomesticRecords',
      meta: { title: '待退回国内记录' },
    },
    // 发货单详情
    {
      path: 'deliveryDetail',
      component: () => import('@/views/modules/deliveryManagement/deliveryDetail'),
      name: 'deliveryDetail',
      hidden: true,
      meta: { title: '发货单详情', noCache: true },
    },
    // 装箱单
    {
      path: 'packingListDetail',
      component: () => import('@/views/modules/deliveryManagement/packingListDetail'),
      name: 'packingListDetail',
      hidden: true,
      meta: { title: '装箱单', noCache: true },
    },
    // 随货发票
    {
      path: 'commercialInvoice',
      component: () => import('@/views/modules/deliveryManagement/commercialInvoice'),
      name: 'commercialInvoice',
      hidden: true,
      meta: { title: '随货发票', noCache: true },
    },
  ],
};

export default deliveryManagement;
