import Layout from '@/layout';

export default {
  path: '/config',
  name: 'config',
  component: Layout,
  meta: { title: '配置', icon: 'el-icon-document' },
  redirect: '/config/employeeList',
  children: [
    // 订单列表
    {
      path: 'employeeList',
      component: () => import('@/views/modules/config/employeeList'),
      name: 'employeeList',
      meta: { title: '职员信息' }
    },
    {
      path: 'brandList',
      component: () => import('@/views/modules/config/brandList'),
      name: 'brandList',
      meta: { title: '品牌' }
    },
    {
      path: 'categoryList',
      component: () => import('@/views/modules/config/categoryList'),
      name: 'categoryList',
      meta: { title: '类别' }
    },
    {
      path: 'warehouseList',
      component: () => import('@/views/modules/config/warehouseList'),
      name: 'warehouseList',
      meta: { title: '仓库' }
    },
    {
      path: 'supplierList',
      component: () => import('@/views/modules/config/supplierList'),
      name: 'supplierList',
      meta: { title: '供应商' }
    },
    {
      path: 'customerList',
      component: () => import('@/views/modules/config/customerList'),
      name: 'customerList',
      meta: { title: '客户' }
    },
    {
      path: 'product',
      component: () => import('@/views/modules/config/product'),
      name: 'product',
      meta: { title: '产品' }
    },
    {
      path: 'batchList',
      component: () => import('@/views/modules/config/batchList'),
      name: 'batchList',
      meta: { title: '批号管理' }
    },
    {
      path: 'companyList',
      component: () => import('@/views/modules/config/companyList'),
      name: 'companyList',
      meta: { title: '公司管理' }
    },
    {
      path: 'saleContract',
      component: () => import('@/views/modules/config/saleContract'),
      name: 'saleContract',
      meta: { title: '销售合同' }
    },
    {
      path: 'discount',
      component: () => import('@/views/modules/config/discount'),
      name: 'discount',
      meta: { title: '促销管理(VIP)' }
    },
    {
      path: 'specialPirce',
      component: () => import('@/views/modules/config/specialPirce'),
      name: 'specialPirce',
      meta: { title: '特价预留(VIP)' }
    },
    {
      path: 'member',
      component: () => import('@/views/modules/config/member'),
      name: 'member',
      meta: { title: '会员(VIP)' }
    }
  ]
};
