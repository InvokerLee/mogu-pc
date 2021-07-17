<template>
  <el-dialog
    width="640px"
    :title="isEdit ? '订单产品编辑' : '订单产品新增'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="orderDetailForm" size="mini" label-width="100px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="productOpts" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="数量：" prop="count">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
              @change="calcBoxCount"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="箱数：">
            <el-input v-model.trim="form.boxCount" disabled placeholder="自动计算"></el-input>
          </el-form-item>
          <el-form-item label="税率：">
            <el-input v-model.trim="form.taxRate" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="仓库：" prop="storeId">
            <warehous-selector :params="form" paramsKey="storeId" :defaultOpions="warehouseOpts" @selectChange="warehouseChange"></warehous-selector>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位：">
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="可用数量：">
            <el-input v-model.trim="form.canUsedCount" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="箱装量：">
            <el-input v-model.trim="form.productBoxCount" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="含税单价：" prop="taxPrice">
            <el-input-number
              v-model="form.taxPrice"
              class="w100"
              :controls="false"
              :precision="2"
              @change="calcPrice"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="未税单价：">
            <el-input v-model.trim="form.noTaxPrice" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="价格提示：">
            <el-input v-model.trim="form.priceTip" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ProductSelector from '@/components/ProductSelector';
import WarehousSelector from '@/components/WarehousSelector';
import { commonCanUsedCount } from '@/api/common';
import BigNumber from 'bignumber.js';

export default {
  components: {
    ProductSelector,
    WarehousSelector
  },
  props: ['visible', 'item', 'storeType'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        productId: '',
        productName: '',
        productBarCode: '',
        productUnit: '',
        taxRate: '',
        count: undefined,
        boxCount: undefined,
        storeId: '',
        storeName: '',
        text: '',

        taxPrice: undefined,
        noTaxPrice: '',
        productBoxCount: '',
        priceTip: '',
        canUsedCount: ''
      },
      rules: {
        productId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        taxPrice: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        storeId: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      productOpts: [],
      warehouseOpts: []
    };
  },
  created() {
    if (this.item && this.item.productId) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.productOpts = [{ name: this.item.productName, productId: this.item.productId }];
      this.warehouseOpts = [{ name: this.item.storeName, id: this.item.storeId }];
    }
  },
  methods: {
    calcBoxCount(val) {
      if (!this.form.productBoxCount || !this.form.count) return;
      this.form.boxCount = Math.ceil(this.form.count / this.form.productBoxCount);
    },
    selectChange(products) {
      const p = products[0] || {};
      this.form.productName = p.name;
      this.form.productBarCode = p.barCode;
      this.form.productUnit = p.unit;
      // TODO:可用数量
      this.form.productBoxCount = p.boxCount;
      this.form.noTaxPrice = p.salseNoTaxPrice;
      this.form.taxRate = p.salesTaxRate;
      this.getCanUsedCount();
      this.calcBoxCount();
    },
    calcPrice(val) {
      if (!this.form.taxRate) return;
      const a = new BigNumber(val).times(this.form.taxRate).dividedBy(100);
      this.form.noTaxPrice = new BigNumber(val).minus(a).toFixed(2);
    },
    warehouseChange(warehouse) {
      const w = warehouse[0] || {};
      this.form.storeName = w.name;
      this.getCanUsedCount();
    },
    getCanUsedCount() {
      if (!this.form.productId || !this.form.storeId) return;
      commonCanUsedCount({
        orderType: this.storeType,
        productId: this.form.productId,
        storeId: this.form.storeId
      }).then(({ result }) => {
        this.form.canUsedCount = result.count;
      }).catch(() => {});
    },
    confirm() {
      this.$refs.orderDetailForm.validate((valid) => {
        if (!valid) return;
        const product = {
          ...this.form,
          taxBoxPrice: this.form.productBoxCount * this.form.taxPrice,
          noTaxBoxPrice: this.form.productBoxCount * this.form.noTaxPrice,
          taxSum: this.form.taxPrice * this.form.count,
          noTaxSum: this.form.noTaxPrice * this.form.count
        };
        this.$emit('finish', product);
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
