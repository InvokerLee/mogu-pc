<template>
  <el-dialog
    width="680px"
    title="取消绑定发货"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form
      ref="cancelBindForm"
      label-width="120px"
      size="mini"
      v-loading="loading"
      :model="form"
      :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号：">
            {{ detail.order_no }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号：">
            {{ detail.batch_no }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户编号：">
            {{ detail.customer_code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物流渠道：" prop="express_code">
            <el-select placeholder="请选择" v-model="form.express_code" @change="expressChange">
              <el-option v-for="item in detail.expresses" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计产生运费：">
            ${{ detail.cost }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">请选择收货地址（账单地址默认与收货地址一致）</div>
      <el-form-item label=" " label-width="0px" prop="address_id">
        <el-radio-group class="radio-group" v-model="form.address_id" @change="addressChange">
          <el-radio class="radio" v-for="item in detail.addresses" :key="item.id" :label="item.id">
            {{
              `${item.company},
              ${item.first_name} ${item.last_name},
              ${item.phone},
              ${item.street2},
              ${item.street},
              ${item.city},
              ${item.state},
              ${item.postcode},
              ${item.country}
              `
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="saveLoading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCancelBindData, cancelBindDelivery } from '@/api/order';

export default {
  props: ['visible', 'order'],
  data() {
    return {
      loading: false,
      saveLoading: false,
      detail: {
        order_no: '',
        batch_no: '',
        customer_code: '',
        cost: '',
        expresses: [],
        addresses: [],
      },
      form: {
        express_code: '',
        address_id: '',
        address_id_type: '',
      },
      rules: {
        express_code: { required: true, message: '请选择物流渠道', trigger: 'blur' },
        address_id: { required: true, message: '请选择地址', trigger: 'blur' },
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.loading = true;
      getCancelBindData(this.order.id).then(res => {
        this.detail = res.data;
        this.expressChange(res.data.expresses[0].code);
        this.addressChange(res.data.addresses[0].id);
      }).catch(() => {
        this.cancel();
      }).finally(() => {
        this.loading = false;
      });
    },
    expressChange(code) {
      this.form.express_code = code;
      const expr = this.detail.expresses.find(v => v.code === code);
      this.detail.cost = expr.cost;
    },
    addressChange(id) {
      this.form.address_id = id;
      const addr = this.detail.addresses.find(v => v.id === id);
      this.form.address_id_type = addr.id_type;
    },
    save() {
      this.$refs.cancelBindForm.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        cancelBindDelivery(this.detail.id, this.form).then(() => {
          this.$message.success('取消绑定成功');
          this.cancel();
        }).catch(() => {}).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 5px;
}
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
