<template>
  <el-dialog
    width="640px"
    :title="isEdit ? '订单产品编辑' : '订单产品新增'"
    :close-on-click-modal="false"
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
            <warehous-selector :params="form" paramsKey="storeId" :defaultOpions="warehouseOpts" @selectChange="getCanUsedCount"></warehous-selector>
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
import { addOrderDetail, editOrderDetail } from '@/api/order';
import { commonCanUsedCount } from '@/api/common';
import ProductSelector from '@/components/ProductSelector';
import WarehousSelector from '@/components/WarehousSelector';

export default {
  components: {
    ProductSelector,
    WarehousSelector
  },
  props: ['visible', 'item', 'order'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        productId: '',
        count: undefined,
        boxCount: undefined,
        taxRate: '',
        storeId: '',
        text: '',

        productUnit: '',
        canUsedCount: '',
        productBoxCount: '',
        taxPrice: undefined,
        noTaxPrice: '',
        priceTip: ''
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
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.getCanUsedCount();
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
      this.form.productUnit = p.unit;
      // TODO:可用数量
      this.form.productBoxCount = p.boxCount;
      this.form.noTaxPrice = p.salseNoTaxPrice;
      this.form.taxRate = p.salesTaxRate;
      this.getCanUsedCount();
      this.calcBoxCount();
    },
    getCanUsedCount() {
      if (!this.form.productId || !this.form.storeId) return;
      commonCanUsedCount({
        orderType: this.getStoreType(),
        productId: this.form.productId,
        storeId: this.form.storeId
      }).then(({ result }) => {
        this.form.canUsedCount = result.count;
      }).catch(() => {});
    },
    getStoreType() {
      if (this.order.orderType.startsWith('shoppe')) {
        return 'shoppe';
      } else if (this.order.orderType.startsWith('sample')) {
        return 'sample';
      }
      return 'public';
    },
    confirm() {
      this.$refs.orderDetailForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.saveForm().then(() => {
          this.$message.success('保存成功');
          this.$emit('success');
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    saveForm() {
      return this.isEdit
        ? editOrderDetail({ id: this.item.id, orderId: this.order.id, ...this.form })
        : addOrderDetail({ ...this.form, orderId: this.order.id });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
