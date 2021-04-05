<template>
  <el-dialog
    width="480px"
    title="查看优惠信息"
    :visible="visible"
    :before-close="cancel"
  >
    <div v-loading="loading">
      <el-row type="flex">
        <el-col class="cell" :span="8">商品优惠</el-col>
        <el-col class="cell justify-start" :span="16">
          <div>
            <div>商品打折：${{ info.product_off.product_discount_off || 0 }}</div>
            <div>商品类优惠券：${{ info.product_off.product_coupon_off || 0 }}</div>
            <div>整单类优惠分摊：${{ info.product_off.product_whole_off || 0 }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="8">运费优惠</el-col>
        <el-col class="cell justify-start" :span="16">
          <div>
            <div>直接减免：${{ info.shipment_off.shipment_off || 0 }}</div>
            <div>运费类优惠券：${{ info.shipment_off.shipment_coupon_off || 0 }}</div>
            <div>整单类优惠分摊：${{ info.shipment_off.shipment_whole_off || 0 }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="8">手续费优惠</el-col>
        <el-col class="cell justify-start" :span="16">
          <div>整单类优惠分摊：${{ info.handle_fee_off.handle_fee_whole_off || 0 }}</div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="8">优惠券名称</el-col>
        <el-col class="cell justify-start" :span="16">
          <div>{{ info.coupon.coupon_name }}</div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { getOrderOff } from '@/api/order';

export default {
  props: ['visible', 'orderId'],
  data() {
    return {
      loading: false,
      info: {
        product_off: {},
        shipment_off: {},
        handle_fee_off: {},
        coupon: {},
      },
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      if (!this.orderId) return;
      this.loading = true;
      getOrderOff(this.orderId)
        .then((res) => {
          this.info = res.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.cell {
  font-size: 14px;
  min-height: 32px;
  padding: 5px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-all;
  box-shadow: 1px 1px 0 0 #d8dce5,
              1px 1px 0 0 #d8dce5 inset;
  &.justify-start {
    justify-content: flex-start;
  }
}
</style>
