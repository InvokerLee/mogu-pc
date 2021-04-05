<template>
  <el-dialog
    width="480px"
    title="申请免单"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="applyFreeForm" label-width="120px" size="mini" :model="form" :rules="rules">
      <el-form-item label="订单编号：">
        {{ order.order_no }}
      </el-form-item>
      <el-form-item label="客户编号：">
        {{ order.customer_code }}
      </el-form-item>
      <el-form-item label="订单总金额：">
        ${{ order.total || 0 }}
      </el-form-item>
      <el-form-item label="免单类型：" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="item in freeType.itemList" :key="item.code" :label="item.code">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="免单备注：" prop="remark">
        <el-input
          type="textarea"
          placeholder="请输入备注"
          :autosize="{ minRows: 3, maxRows: 5}"
          v-model.trim="form.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">申请免单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderApplyFree } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      form: {
        remark: '',
      },
      rules: {
        type: [
          { required: true, message: '请选择免单类型', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    freeType() {
      return this.$store.getters.getConstByGroup('free_type');
    },
  },
  methods: {
    save() {
      this.$refs.applyFreeForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        orderApplyFree(this.order.id, this.form)
          .then(() => {
            this.$message.success('申请成功');
            this.$emit('success');
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
