<template>
  <el-dialog
    width="480px"
    :title="isApproved ? '审核通过' : '审核不通过'"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form class="m-t-10" ref="auditForm" size="mini" :model="form" @submit.native.prevent>
      <el-form-item label="退款金额：">
        ${{ item.refund_amount }}
      </el-form-item>
      <el-form-item
        :label="isApproved ? '请填写审核备注：' : '请填写审核不通过的原因：'"
        prop="remark"
        :rules="{ required: !isApproved, message: '必填项', trigger: 'blur' }"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          v-model.trim="form.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div v-if="isApproved">
      确认审核通过？
    </div>
    <div v-else>
      确认审核不通过？确认此单将作废，可重新提交申请。
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { refundApplyAudit } from '@/api/order';

export default {
  props: ['visible', 'isApproved', 'item'],
  data() {
    return {
      loading: false,
      form: {
        audit_status: '',
        remark: '',
      },
    };
  },
  created() {
    this.form.audit_status = this.isApproved ? 2 : -1;
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.auditForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        refundApplyAudit(this.item.id, this.form)
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
  },
};
</script>
