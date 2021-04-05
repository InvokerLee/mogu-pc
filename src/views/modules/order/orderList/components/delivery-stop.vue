<template>
  <el-dialog
    width="580px"
    :title="`${isStop ? '' : '取消'}发货拦截`"
    :close-on-click-modal="false"
    :visible="visible"
    :before-close="cancel"
  >
    <el-form ref="deliverStopForm" label-width="100px" size="mini" :model="form" :rules="rules" @submit.native.prevent>
      <el-form-item label="拦截订单：">
        {{ order.order_no }}
      </el-form-item>
      <div v-if="!isStop">
        <el-form-item label="拦截时间：">
          {{ order.intercept_time }}
        </el-form-item>
        <el-form-item label="拦截原因：">
          {{ order.intercept_reason }}
        </el-form-item>
      </div>
      <el-form-item label="拦截原因：" prop="reason" v-else>
        <el-radio-group class="radio-group" v-model="form.reason">
          <el-radio class="radio" v-for="item in deliverInterceptReason.itemList" :key="item.code" :label="item.code">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deliveryIntercept, cancelDeliveryIntercept } from '@/api/order';

export default {
  props: ['visible', 'isStop', 'order'],
  data() {
    return {
      loading: false,
      form: {
        reason: '',
      },
      rules: {
        reason: [
          { required: true, message: '请选择原因', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    deliverInterceptReason() {
      return this.$store.getters.getConstByGroup('deliver_intercept_reason');
    },
  },
  created() {
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      if (this.isStop) {
        this.stop();
      } else {
        this.unStop();
      }
    },
    stop() {
      this.$refs.deliverStopForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        deliveryIntercept(this.order.id, this.form)
          .then(() => {
            this.$message.success('操作成功');
            this.$emit('success');
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    unStop() {
      this.loading = true;
      cancelDeliveryIntercept(this.order.id, this.form)
        .then(() => {
          this.$message.success('操作成功');
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

<style lang="scss" scoped>
.radio-group {
  width: 100%;
  .radio {
    padding: 6px 0;
    display: flex;
    >>> .el-radio__label {
      white-space: normal;
    }
  }
}
</style>
