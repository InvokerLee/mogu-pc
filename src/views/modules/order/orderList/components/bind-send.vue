<template>
  <el-dialog
    width="680px"
    title="绑定发货"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form label-width="130px" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号：">
            {{ detail.order_no }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号：">
            {{ detail.batch_no }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户编号：">
            {{ detail.customer_code }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流渠道：">
            {{ detail.express }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="预计产生续重费：">
          ${{ continuation_cost }}
        </el-form-item>
      </el-row>
    </el-form>
    <div class="title">请选择需要绑定的订单</div>
    <span class="font-red font-12">（物流渠道或地址信息不一致的订单不可以直接绑定，可以先修改信息再绑定。）</span>
    <el-table
      border
      size="mini"
      v-loading="loading"
      max-height="300px"
      :data="detail.can_bind_delivery_orders"
    >
      <el-table-column width="55px" label="选择" align="center">
        <template slot-scope="scope">
          <el-radio v-model="selectedItem" :label="scope.row">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="order_no" label="订单号" align="center"></el-table-column>
      <el-table-column prop="batch_no" label="批次号" align="center"></el-table-column>
      <el-table-column prop="status_text" label="订单状态" align="center"></el-table-column>
      <el-table-column prop="express" label="物流渠道" align="center"></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="saveLoading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCanBindOrders, getContinuationCost, bindDelivery } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      saveLoading: false,
      detail: {},
      continuation_cost: '',
      tableData: [],
      selectedItem: null,
    };
  },
  watch: {
    selectedItem(val) {
      if (!val.order_id) return;
      getContinuationCost(val.order_id, {
        bind_order_id: this.detail.order_id,
      }).then((res) => {
        this.continuation_cost = res.data.continuation_cost;
      }).catch(() => {});
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.loading = true;
      getCanBindOrders(this.order.id).then(res => {
        this.detail = res.data;
      }).catch(() => {
        this.cancel();
      }).finally(() => {
        this.loading = false;
      });
    },
    save() {
      if (!this.selectedItem) {
        this.$message.warning('请选择需要绑定的订单');
        return;
      }
      this.saveLoading = true;
      bindDelivery(this.selectedItem.order_id, {
        bind_order_id: this.detail.order_id,
      }).then(() => {
        this.$message.success('绑定成功');
        this.cancel();
      }).catch(() => {}).finally(() => {
        this.saveLoading = false;
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 5px;
}
</style>
