<template>
  <el-dialog
    width="400px"
    title="调整报价有效期"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form size="mini" ref="delayValidForm" label-width="130px" :model="form" :rules="rules" @submit.native.prevent>
      <el-form-item label="当前报价有效期：">
        {{ item.expired_date }}
      </el-form-item>
      <el-form-item label="调整为：" prop="expired_date">
        <el-date-picker
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.expired_date"
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
import { inquirySetExpireDate } from '@/api/order';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        expired_date: '',
      },
      rules: {
        expired_date: [
          { required: true, message: '必选项', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.delayValidForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        inquirySetExpireDate(this.item.id, this.form)
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
