<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '产品编辑' : '产品新增'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="outStoreForm" size="mini" label-width="120px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="productOptions" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="单位：">
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="箱数：">
            <el-input v-model.trim="form.boxCount" disabled placeholder="自动计算"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="条码：">
            <el-input v-model.trim="form.productBarCode" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="数量：" prop="count">
            <el-input-number
              v-model="form.count"
              placeholder="请选择产品后输入"
              class="w100"
              :controls="false"
              :precision="0"
              :disabled="!form.productId"
              @change="countChange"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="入库仓库：" prop="storeInId">
            <warehous-selector :params="form" paramsKey="storeInId" :defaultOpions="warehouseOpts2" @selectChange="inStoreChange"></warehous-selector>
          </el-form-item>
          <el-form-item v-if="order.orderType === 'outStoreAllocationInStore'" label="出库仓库：" prop="storeOutId">
            <warehous-selector :params="form" paramsKey="storeOutId" :defaultOpions="warehouseOpts" @selectChange="storeChange"></warehous-selector>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ProductSelector from '@/components/ProductSelector';
import WarehousSelector from '@/components/WarehousSelector';
import { inStockDetailEdit } from '@/api/warehouse';

export default {
  components: {
    ProductSelector,
    WarehousSelector
  },
  props: ['visible', 'item', 'order'],
  data() {
    return {
      isEdit: false,
      form: {
        productId: '',
        count: undefined,
        text: '',
        storeOutId: '',
        storeOutName: '',
        storeInId: '',
        storeInName: '',

        productName: '',
        storeName: '',
        productSpec: '', // 规格
        productBarCode: '', // 条码
        productUnit: '' // 单位
      },
      productBoxCount: '',
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        storeInId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        storeOutId: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      productOptions: [],
      warehouseOpts: [],
      warehouseOpts2: []
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.productOptions = [{ name: this.item.productName, productId: this.item.productId }];
      this.warehouseOpts = [{ name: this.item.storeOutName, id: this.item.storeOutId }];
      this.warehouseOpts2 = [{ name: this.item.storeInName, id: this.item.storeInId }];
      this.productBoxCount = this.item.productBoxCount;
    }
  },
  methods: {
    selectChange(products) {
      const p = products[0] || {};
      this.form.productName = p.name;
      this.form.productSpec = p.spec;
      this.form.productBarCode = p.barCode;
      this.form.productUnit = p.unit;
      this.productBoxCount = p.boxCount;
      this.form.count = undefined;
    },
    storeChange(storeList) {
      const s = storeList[0] || {};
      this.form.storeOutName = s.name;
    },
    inStoreChange(storeList) {
      const s = storeList[0] || {};
      this.form.storeInName = s.name;
    },
    countChange(val) {
      this.form.boxCount = Math.ceil(val / this.productBoxCount);
    },
    confirm() {
      this.$refs.outStoreForm.validate((valid) => {
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
      return inStockDetailEdit({
        orderId: this.order.id,
        id: this.item.id,
        ...this.form
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
