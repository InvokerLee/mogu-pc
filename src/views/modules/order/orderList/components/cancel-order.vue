<template>
  <el-dialog
    width="680px"
    title="取消订单"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="refundForm" label-width="120px" size="mini" :model="form" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单编号：">
            {{ order.order_no }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户编号：">
            {{ order.customer_code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="应付金额：">
            ${{ order.total }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付方式：">
            {{ order.pay_type_text }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="取消原因：" prop="reason">
            <el-select class="w100" v-model="form.reason">
              <el-option v-for="item in refundReason.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退款方式：" prop="way">
            <el-select class="w100" v-model="form.way">
              <el-option v-for="item in refundWay.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收取取货费：">
            <el-input v-model.trim="form.take_fee"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收取其他费用">
            <el-input v-model.trim="form.else_fee"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="原因备注：">
        <el-input
          type="textarea"
          placeholder="请输入退款备注"
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
import { orderCancel } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      form: {
        reason: '',
        way: '',
        take_fee: '',
        else_fee: '',
        remark: '',
      },
      rules: {
        reason: [
          { required: true, message: '请选择取消原因', trigger: 'blur' },
        ],
        way: [
          { required: true, message: '请选择退款方式', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    refundReason() {
      return this.$store.getters.getConstByGroup('refund_reason');
    },
    refundWay() {
      return this.$store.getters.getConstByGroup('refund_way');
    },
  },
  methods: {
    save() {
      this.$refs.refundForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        orderCancel(this.order.id, this.form)
          .then(() => {
            this.$message.success('取消成功');
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
