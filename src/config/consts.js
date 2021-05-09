export default {
  // 订单类型
  orderType: [
    { label: '销售订单', value: 'sales' },
    { label: '销售退货单', value: 'salesReturn' },
    { label: '采购订单', value: 'stock' },
    { label: '采购退货单', value: 'stockReturn' },
    { label: '专柜调货申请单', value: 'shoppeApply' },
    { label: '专柜销售单', value: 'shoppeSales' },
    { label: '专柜销售退货单', value: 'shoppeSalesReturn' },
    { label: '样品申请单', value: 'sampleApply' },
    { label: '样品退回单', value: 'sampleReturn' }
  ],
  outStockType: [
    { label: '采购退货出库', value: 'stockReturnOutStore' },
    { label: '销售发货出库', value: 'salesOutStore' },
    { label: '报损出库', value: 'damageOutStore' },
    { label: '外仓调拨出库', value: 'outStoreAllocationOutStore' },
    { label: '专柜发货出库', value: 'shoppeOutStore' },
    { label: '样品发货出库', value: 'sampleOutStore' },
    { label: '其他出库', value: 'otherOutStore' }
  ],
  inStockType: [
    { label: '采购进货入库', value: 'stockInStore' },
    { label: '销售退货入库', value: 'salesReturnInStore' },
    { label: '其他入库', value: 'otherInStore' },
    { label: '外仓调拨入库', value: 'outStoreAllocationInStore' }
  ],
  inOutStockType: [
    { label: '采购退货出库', value: 'stockReturnOutStore' },
    { label: '销售发货出库', value: 'salesOutStore' },
    { label: '报损出库', value: 'damageOutStore' },
    { label: '外仓调拨出库', value: 'outStoreAllocationOutStore' },
    { label: '专柜发货出库', value: 'shoppeOutStore' },
    { label: '样品发货出库', value: 'sampleOutStore' },
    { label: '其他出库', value: 'otherOutStore' },
    { label: '采购进货入库', value: 'stockInStore' },
    { label: '销售退货入库', value: 'salesReturnInStore' },
    { label: '其他入库', value: 'otherInStore' },
    { label: '外仓调拨入库', value: 'outStoreAllocationInStore' }
  ]
};
