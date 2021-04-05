<template>
  <el-dialog
    width="640px"
    title="作废补发商品"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="forbidForm" label-width="120px" size="mini" :model="form" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="归属订单：">
            {{ item.order_no }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户编号：">
            {{ item.customer_code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="补发商品金额：">
            ${{ item.money }}
            <span class="font-red">(已扣除优惠)</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付方式：">
            {{ payType[item.pay_type] }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="退款方式：" prop="way">
            <el-select class="w100" v-model="form.way">
              <el-option v-for="i in refundWay.itemList" :key="i.code" :label="i.name" :value="i.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收取取货费：">
            <el-input v-model.trim="form.take_fee"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="作废原因：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            v-model.trim="form.apply_remark"
          >
          </el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">作废并退款</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { forbidSupplyProduct } from '@/api/order';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        way: '',
        take_fee: '',
        apply_remark: '',
      },
      rules: {
        way: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    refundWay() {
      return this.$store.getters.getConstByGroup('refund_way');
    },
    payType() {
      return this.$store.getters.getConstByGroup('pay_type');
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.forbidForm.validate((valid) => {
        if (!valid) return;
        const params = {
          ...this.form,
          supply_pro_ids: [this.item.id],
        };
        this.loading = true;
        forbidSupplyProduct(params).then(() => {
          this.$message.success('作废成功');
          this.$emit('success');
        }).catch(() => {}).finally(() => {
          this.loading = false;
        });
      });
    },
  },
};
</script>
