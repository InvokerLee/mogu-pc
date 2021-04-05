<template>
  <div class="add-remittance">
    <el-row type="flex" justify="space-between">
      <el-button type="info" size="mini" icon="el-icon-back" @click="back">返回</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="submit">保存</el-button>
    </el-row>
    <el-form
      ref="addRemitForm"
      size="mini"
      label-width="130px"
      :inline="true"
      :model="form"
      :rules="rules"
      v-loading="loading"
    >
      <div>
        <div class="title">客户信息</div>
        <el-form-item label="客户编号：">
          <div class="w220">{{ orderInfo.customer_code }}</div>
        </el-form-item>
        <el-form-item label="客户名称：">
          <div class="w220">{{ orderInfo.username }}</div>
        </el-form-item>
        <el-form-item label="汇款人名称：">
          <el-input class="w220" v-model.trim="form.remitter_name"></el-input>
        </el-form-item>
        <el-form-item label="汇款账号：">
          <el-input class="w220" v-model.trim="form.remitter_account"></el-input>
        </el-form-item>
        <el-form-item label="汇款银行：">
          <el-input class="w220" v-model.trim="form.remitter_bank">></el-input>
        </el-form-item>
        <el-form-item label="Swift Code：">
          <el-input class="w220" v-model.trim="form.swift_code">></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="汇款凭证：">
            <el-upload
              action=""
              :limit="1"
              :auto-upload="false"
              :on-change="(file) => { form.remitter_certificate = file.raw }"
              :on-remove="() => { form.remitter_certificate = null }"
              :on-exceed="onExceed"
            >
              <el-button slot="trigger" size="mini" type="text">+ 添加附件</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
      </div>
      <div>
        <div class="title">到账信息</div>
        <el-form-item prop="money_remitter">
          <el-tooltip slot="label" effect="dark" content="英文名称: Remittance/Transfer Amount" placement="bottom">
            <span>汇款金额：</span>
          </el-tooltip>
          <el-input style="width: 135px;" v-model.trim="form.money_remitter" @change="getReceiveMoney"></el-input>
          <el-select style="width: 80px;" v-model="form.currency" @change="currencyChange">
            <el-option label="USD" value="USD"></el-option>
            <el-option label="CNY" value="CNY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="money_fee">
          <el-tooltip slot="label" effect="dark" content="英文名称：Commission" placement="bottom">
            <span>手续费：</span>
          </el-tooltip>
          <el-input class="w220" v-model.trim="form.money_fee" @change="getReceiveMoney"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip slot="label" effect="dark" content="英文名称：Amount Credited" placement="bottom">
            <span>实际到账金额：</span>
          </el-tooltip>
          <div class="w220">{{ form.money_receive }}</div>
        </el-form-item>
        <el-form-item label="到账日期：" prop="transfer_at">
          <el-date-picker
            v-model="form.transfer_at"
            value-format="yyyy-MM-dd 23:59:59"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="流水号：" prop="transaction_no">
          <el-input class="w220" v-model.trim="form.transaction_no"></el-input>
        </el-form-item>
        <el-form-item label="收款人名称：">
          <div class="w220">{{ form.payee_name }}</div>
        </el-form-item>
        <el-form-item label="收款银行账号：">
          <div class="w220">{{ form.bank_account }}</div>
        </el-form-item>
        <el-row>
          <el-form-item label="银行回单：">
            <span class="font-gray">(财务查账时提供的确认收到客户款项的银行回单)</span>
            <el-upload
              action=""
              :limit="1"
              :auto-upload="false"
              :on-change="(file) => { form.bank_receipt = file.raw }"
              :on-remove="() => { form.bank_receipt = null }"
              :on-exceed="onExceed"
            >
              <el-button slot="trigger" size="mini" type="text">+ 添加附件</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
      </div>
      <div>
        <div class="title">
          <span class="fl">关联订单</span>
          <div class="fl m-l-10">
            <el-button size="mini" type="primary" @click="addRelateOrder">新增关联订单</el-button>
          </div>
        </div>
        <el-table
          border
          size="mini"
          height="120px"
          v-adaptive-height
          :data="order_infos"
        >
          <el-table-column prop="order_no" label="订单号" align="center"></el-table-column>
          <el-table-column prop="unpay_money" label="剩余应收款金额" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                class="font-red"
                type="text"
                size="mini"
                v-if="scope.row.order_no !== orderInfo.order_no"
                @click="removeItems(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import { transferReceiptCreate, transferReceiptOrderAdd, transferReceiptStore } from '@/api/order';
import calculator from '@/utils/calculator';

export default {
  components: {
  },
  data() {
    return {
      loading: false,
      form: {
        remitter_name: '',
        remitter_account: '',
        remitter_bank: '',
        swift_code: '',
        remitter_certificate: null,
        money_remitter: '',
        currency: 'USD',
        money_fee: '',
        money_receive: '',
        transfer_at: '',
        transaction_no: '',
        payee_name: '香港立创',
        bank_account: '819845926838（汇丰）',
        bank_receipt: null,
      },
      rules: {
        money_remitter: [
          { required: true, message: '汇款金额必填', trigger: 'blur' },
          { pattern: /(^[1-9]\d*(\.\d{1,6})?$)|(^0(\.\d{1,6})$)/, message: '整数或保留6位小数', trigger: 'blur' },
        ],
        money_fee: [
          { required: true, message: '手续费必填', trigger: 'blur' },
          { pattern: /(^[1-9]\d*(\.\d{1,6})?$)|(^0(\.\d{1,6})$)/, message: '整数或保留6位小数', trigger: 'blur' },
        ],
        transfer_at: [
          { required: true, message: '到账日期必选', trigger: 'blur' },
        ],
        transaction_no: [
          { required: true, message: '流水号必填', trigger: 'blur' },
        ],
      },
      order_infos: [],
    };
  },
  computed: {
    orderInfo() {
      const item = this.order_infos.find(v => v.order_no === this.$route.query.order_no);
      return item || {};
    },
  },
  created() {
    if (this.$route.query.order_no) {
      this.getOrderInfo(this.$route.query.order_no);
    }
  },
  methods: {
    back() {
      this.$router.push('/order/offlineRemittance');
    },
    getOrderInfo(orderCode) {
      transferReceiptCreate({ orderCode }).then(({ data }) => {
        this.order_infos = data.order_infos;
      }).catch(() => {});
    },
    submit() {
      this.$refs.addRemitForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        const form = new FormData();
        Object.keys(this.form).forEach((key) => {
          if (this.form[key]) {
            form.append(key, this.form[key]);
          }
        });
        transferReceiptStore(form).then((res) => {
          this.$message.success('保存成功');
          this.back();
        }).catch(() => {}).finally(() => {
          this.loading = false;
        });
      });
    },
    onExceed() {
      this.$message.warning('超出文件上传数量限制');
    },
    currencyChange(val) {
      this.form.payee_name = val === 'USD' ? '香港立创' : '深圳技新';
      this.form.bank_account = val === 'USD' ? '819845926838（汇丰）' : '699515972（民生）';
    },
    getReceiveMoney() {
      let isError = false;
      this.$refs.addRemitForm.validateField(['money_remitter', 'money_fee'], (err) => {
        if (err) {
          isError = true;
        }
      });
      if (!isError) {
        const m = calculator.minus(this.form.money_remitter, this.form.money_fee).done();
        this.form.money_receive = m < 0 ? '0' : m;
      }
    },
    addRelateOrder() {
      if (!this.checkRemitterMoney()) return;
      this.$prompt('', '请输入订单号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputValidator: (val) => {
          if (!val) {
            return '请输入外贸订单号';
          }
          return true;
        },
      }).then(({ value }) => {
        const params = {
          orderCode: this.orderInfo.order_no,
          addOrderCode: value,
        };
        transferReceiptOrderAdd(params).then(({ data }) => {
          if (!this.order_infos.some(v => v.order_no === data.order_no)) {
            this.order_infos.push(data);
          }
        }).catch(() => {});
      }).catch(() => {});
    },
    checkRemitterMoney() {
      if (!this.form.money_remitter) {
        this.$message.warning('未输入汇款金额');
        return false;
      }
      const totalOrderAmount = this.order_infos.reduce((acc, cur) => {
        if (cur.unpay_money) {
          return calculator.add(acc, cur.unpay_money).done();
        }
        return acc;
      }, 0);
      if (this.form.money_remitter <= totalOrderAmount) {
        this.$message.warning('注意汇款金额已不足以分配至新订单');
        return false;
      }
      return true;
    },
    removeItems(i) {
      this.order_infos.splice(i, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.add-remittance {
  width: 100%;
  padding: 20px;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin: 5px 0 15px;
    border-bottom: 1px solid #d8dce5;
  }
  .w220 {
    width: 220px;
  }
}
</style>
