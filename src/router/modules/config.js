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
    }
  ]
};
