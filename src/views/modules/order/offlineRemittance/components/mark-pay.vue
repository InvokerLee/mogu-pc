<template>
  <el-dialog
    width="480px"
    title="标记支付"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form size="mini" label-width="100px" :model="form" @submit.native.prevent>
      <el-form-item label="订单号：">
        {{ item.order_no }}
      </el-form-item>
      <el-form-item label="客户编号：">
        {{ item.customer_code }}
      </el-form-item>
      <el-form-item label="应收金额：">
        <span>{{ item.currency === 'USD' ? '$' : '￥' }}</span>
        {{ item.total }}
      </el-form-item>
      <el-form-item label="支付方式：">
        {{ payType[item.pay_type] }}
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          v-model.trim="form.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderMarkPay } from '@/api/order';
export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        remark: '',
      },
    };
  },
  computed: {
    payType() {
      return this.$store.getters.getConstByGroup('pay_type');
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.loading = true;
      orderMarkPay(this.item.id, this.form)
        .then(() => {
          this.$message.success('标记成功');
          this.$emit('success');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
