<template>
  <el-dialog
    width="360px"
    title="修改订单支付方式"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form inline size="mini" :model="form">
      <el-form-item label="修改为：">
        <el-select style="width: 220px;" v-model="form.pay_type">
          <el-option v-for="item in payTypes" :key="item.code" :value="item.code" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getOrderPayType, updateOrderPayType } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      form: {
        pay_type: '',
      },
      payTypes: [],
    };
  },
  created() {
    this.getTypes();
  },
  methods: {
    getTypes() {
      getOrderPayType(this.order.id)
        .then(({ data }) => {
          this.payTypes = data.itemList;
        })
        .catch(() => {});
    },
    save() {
      this.loading = true;
      updateOrderPayType(this.order.id, this.form)
        .then(() => {
          this.$message.success('修改成功');
          this.$emit('success');
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
