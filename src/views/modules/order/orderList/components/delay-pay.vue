<template>
  <el-dialog
    width="400px"
    title="调整到期时间"
    :close-on-click-modal="false"
    :visible="visible"
    :before-close="cancel"
  >
    <el-form ref="delayPayForm" size="mini" label-width="100px" :model="form" @submit.native.prevent>
      <el-form-item
        label="到期时间："
        prop="pay_expired_time"
        :rules="{ required: true, message: '必填', trigger: 'change' }"
      >
        <el-date-picker
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.pay_expired_time"
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
import { orderUpdatePayTime } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      form: {
        pay_expired_time: '',
      },
    };
  },
  created() {
    if (this.order.expired_date) {
      this.form.pay_expired_time = this.order.expired_date;
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.delayPayForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        orderUpdatePayTime(this.order.id, this.form)
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
