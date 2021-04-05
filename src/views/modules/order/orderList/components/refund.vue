<template>
  <el-dialog
    width="680px"
    title="申请补退款"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form
      ref="refundForm"
      class="refund"
      label-width="110px"
      size="mini"
      :model="form"
      :rules="rules"
    >
      <el-form-item class="item" label="订单编号：">
        <el-button type="text" size="mini" @click="toDetail">{{ order.order_no }}</el-button>
      </el-form-item>
      <el-form-item class="item" label="客户编号：">
        {{ order.customer_code }}
      </el-form-item>
      <el-form-item class="item" label="申请类型：">
        <el-radio-group v-model="viewType" @change="typeChange">
          <el-radio label="supply">补款</el-radio>
          <el-radio label="refund">退款</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="viewType === 'supply'">
        <el-form-item class="item" label="补款类型：" prop="supply_type">
          <el-radio-group v-model="form.supply_type" @change="typeChange">
            <el-radio :label="1">应收补款</el-radio>
            <el-radio :label="2">费用补款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="item" label="补款金额：" prop="supply_money">
          <el-input v-model.trim="form.supply_money"></el-input>
        </el-form-item>
        <el-form-item class="item" label="币种：" prop="currency">
          <el-radio-group v-model="form.currency">
            <el-radio label="USD">USD</el-radio>
            <el-radio label="CNY">CNY</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item class="item" label="退款方式：" prop="way">
          <el-select class="w100" v-model="form.way">
            <el-option v-for="item in refundWay.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item" prop="ship_refund">
          <span slot="label">
            <span>运费退款：</span>
            <br>
            <span class="font-12 font-red" v-if="refundInfo.can_refund_ship">(可退：{{ refundInfo.can_refund_ship }})</span>
          </span>
          <el-input v-model.trim="form.ship_refund"></el-input>
        </el-form-item>
        <el-form-item class="item" prop="else_refund">
          <span slot="label">
            <span>手续费退款：</span>
            <br>
            <span class="font-12 font-red" v-if="refundInfo.can_refund_else">(可退：{{ refundInfo.can_refund_else }})</span>
          </span>
          <el-input v-model.trim="form.else_refund"></el-input>
        </el-form-item>
      </template>
      <el-form-item class="item" :label="`${viewType === 'supply' ? '补款' : '退款'}原因：`" prop="reason">
        <el-select class="w100" v-model="form.reason">
          <el-option v-for="i in reasonList" :label="i" :value="i" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item" label="申请备注：" prop="apply_remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          v-model.trim="form.apply_remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="font-red" v-if="viewType === 'supply'">
      （填写说明：如客户少付订单金额，补款类型请选择应收补付；如是额外需补收客户费用，例如运费，或补发重发产生费用需客户承担，类型应为补收费用。）
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { canRefundInfo, supplyApply, refundApply } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      viewType: 'supply',
      reasonList: [],
      form: {
        supply_type: '',
        supply_money: '',
        currency: '',
        way: '',
        ship_refund: '',
        else_refund: '',
        reason: '',
        apply_remark: '',
      },
      rules: {
        supply_type: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        supply_money: [
          { required: true, message: '请填写', trigger: 'blur' },
        ],
        currency: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        reason: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        way: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        ship_refund: [
          { required: true, message: '请填写', trigger: 'blur' },
        ],
        else_refund: [
          { required: true, message: '请填写', trigger: 'blur' },
        ],
      },
      refundInfo: {
        can_refund_ship: 22.14,
        can_refund_else: 3,
      },
    };
  },
  computed: {
    refundWay() {
      return this.$store.getters.getConstByGroup('refund_way');
    },
  },
  created() {
    this.getRefundInfo();
  },
  methods: {
    getRefundInfo() {
      canRefundInfo(this.order.id).then((res) => {
        this.refundInfo = res.data;
      }).catch(() => {});
    },
    toDetail() {
      this.cancel();
      this.$router.push(`/order/orderDetail?orderId=${this.order.id}`);
    },
    save() {
      this.$refs.refundForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.saveForm().then(() => {
          this.$message.success('保存成功');
          this.cancel();
        }).catch(() => {}).finally(() => {
          this.loading = false;
        });
      });
    },
    saveForm() {
      const params = {
        reason: this.form.reason,
        apply_remark: this.form.apply_remark,
      };
      if (this.viewType === 'supply') {
        ['supply_type', 'supply_money', 'currency'].forEach((k) => {
          params[k] = this.form[k];
        });
        return supplyApply(this.order.id, params);
      } else {
        ['way', 'ship_refund', 'else_refund'].forEach((k) => {
          params[k] = this.form[k];
        });
        return refundApply(this.order.id, params);
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    typeChange() {
      // 清空原来的原因
      this.form.reason = '';
      this.reasonList = this.viewType === 'refund'
        ? ['挂单', '信用卡欺诈', '下错物料', '延误', '其他']
        : [
          [],
          ['客户少付', '客户未承担汇出行手续费', '补付'],
          ['退件重发补收运费', '售后补发补收运费', '拆单补发补收运费', '批次变更补收运费', '变更发货方式补收运费', '退件海外服务商仓库重新发出费用补收'],
        ][this.form.supply_type];
      this.$refs.refundForm.clearValidate();
    },
  },
};
</script>

<style lang="scss" scoped>
.refund {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 310px;
  }
}
</style>
