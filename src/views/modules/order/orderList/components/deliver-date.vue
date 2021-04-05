<template>
  <el-dialog
    width="400px"
    title="调整交期"
    :close-on-click-modal="false"
    :visible="visible"
    :before-close="cancel"
  >
    <el-form ref="deliverDateForm" size="mini" :model="form" :rules="rules" @submit.native.prevent>
      <el-form-item label="订货预计交期：" prop="expected_delivery">
        <el-date-picker
          v-model="form.expected_delivery"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateExpectedDelivery } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      form: {
        expected_delivery: '',
      },
      rules: {
        expected_delivery: [
          { required: true, message: '请选择日期', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    if (this.order.expected_delivery) {
      this.form.expected_delivery = this.order.expected_delivery;
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.deliverDateForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        updateExpectedDelivery(this.order.id, this.form)
          .then(() => {
            this.$message.success('调整成功');
            this.$emit('success');
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>
