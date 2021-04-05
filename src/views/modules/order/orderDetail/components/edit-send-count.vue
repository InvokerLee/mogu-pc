<template>
  <el-dialog
    width="750px"
    title="修改订单发货数量"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="sendCountForm" label-width="120px" size="mini" :model="form" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号：">
            {{ orderInfo.order_no }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付方式：">
            {{ orderInfo.pay_type }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="修改原因：" prop="reason">
            <el-select class="w100" v-model="form.reason">
              <el-option label="真实库存不足" value="真实库存不足"></el-option>
              <el-option label="客户要求少发" value="客户要求少发"></el-option>
              <el-option label="供应商来少料" value="供应商来少料"></el-option>
              <el-option label="供应商供应数量不足/无法供货" value="供应商供应数量不足/无法供货"></el-option>
              <el-option label="客户买错/买多" value="客户买错/买多"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理方式：" prop="handle_way">
            <el-radio-group v-model="form.handle_way">>
              <el-radio :label="1">退款</el-radio>
              <el-radio :label="2">拆单补发</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div v-if="form.handle_way === 1">
          <el-col :span="12">
            <el-form-item label="退款方式：" prop="way">
              <el-select class="w100" v-model="form.way">
                <el-option v-for="item in refundWay.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收取取货费：">
              <el-input v-model.trim="form.take_fee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收取其他费用：">
              <el-input v-model.trim="form.else_fee"></el-input>
            </el-form-item>
          </el-col>
        </div>
        <el-col :span="12">
          <el-form-item label="原因备注：" prop="apply_remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model.trim="form.apply_remark"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
        border
        size="mini"
        max-height="360px"
        v-loading="loading"
        :data="form.order_products"
      >
        <el-table-column width="55px" type="index" align="center"></el-table-column>
        <el-table-column prop="product_number" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="originalShipQuantity" label="当前发货数量" align="center"></el-table-column>
        <el-table-column label="发货数量修改为" align="center">
          <template slot-scope="scope">
            <el-form-item
              label-width="0px"
              label=""
              :prop="'order_products.' + scope.$index + '.ship_quantity'"
              :rules="rules.ship_quantity"
            >
              <el-input-number
                class="w100"
                size="mini"
                :controls="false"
                :precision="0"
                :min="0"
                :max="scope.row.originalShipQuantity"
                v-model="scope.row.ship_quantity"
                @change="numberChange(scope.row, scope.$index)"
              >
              </el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="变更数量" align="center">
          <template slot-scope="scope">
            <div class="font-red">
              <span v-if="scope.row.changeNumber">
                -
              </span>
              <span>{{ scope.row.changeNumber }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="changePrice" label="价值金额(USD)" align="center"></el-table-column>
      </el-table>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="saveLoading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { productQuantityInit, updateProductQuantity } from '@/api/order';
import calculator from '@/utils/calculator';

export default {
  props: ['visible', 'products', 'orderInfo'],
  data() {
    return {
      loading: false,
      saveLoading: false,
      form: {
        reason: '',
        handle_way: '',
        way: '',
        take_fee: '',
        else_fee: '',
        apply_remark: '',
        order_products: [],
      },
      rules: {
        reason: [
          { required: true, message: '请选择修改原因', trigger: 'change' },
        ],
        handle_way: [
          { required: true, message: '请选择处理方式', trigger: 'change' },
        ],
        way: [
          { required: true, message: '请选择退款方式', trigger: 'change' },
        ],
        ship_quantity: [
          { required: true, message: '请输入发货数量', trigger: 'change' },
        ],
      },
    };
  },
  computed: {
    refundWay() {
      return this.$store.getters.getConstByGroup('refund_way');
    },
  },
  created() {
    this.initTableData();
  },
  methods: {
    initTableData() {
      if (!this.orderInfo.id) return;
      const params = {
        order_product_ids: this.products.map(v => v.id),
      };
      this.loading = true;
      productQuantityInit(this.orderInfo.id, params).then((res) => {
        this.form.order_products = res.data.products.map(v => ({
          ...v,
          originalShipQuantity: v.ship_quantity,
          changeNumber: 0,
          changePrice: 0,
        }));
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.sendCountForm.validate((valid) => {
        if (!valid) return;
        const changedProducts = this.form.order_products.filter(v => v.changeNumber);
        if (!changedProducts.length) {
          this.$message.warning('请先修改发货数量再保存');
          return;
        }
        const params = {
          handle_way: this.form.handle_way,
          reason: this.form.reason,
          apply_remark: this.form.apply_remark,
          order_products: changedProducts,
        };
        if (params.handle_way === 1) {
          Object.assign(params, {
            way: this.form.way,
            else_fee: this.form.else_fee,
            take_fee: this.form.take_fee,
          });
        }
        this.saveLoading = true;
        updateProductQuantity(this.orderInfo.id, params).then(() => {
          this.$message.success('修改成功');
          this.$emit('success');
        }).catch(() => {}).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    numberChange(row, i) {
      this.$refs.sendCountForm.validateField(`order_products.${i}.ship_quantity`, (err) => {
        if (!err) {
          row.changeNumber = calculator.minus(row.originalShipQuantity, row.ship_quantity).done();
          row.changePrice = calculator.times(row.changeNumber, row.price_real).done();
        }
      });
    },
  },
};
</script>
