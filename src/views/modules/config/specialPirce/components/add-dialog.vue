<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '产品编辑' : '产品新增'"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="contractForm" size="mini" label-width="120px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="预留产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="productOptions" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="条码：">
            <el-input v-model.trim="form.productBarCode" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="预留数量：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格：">
            <el-input v-model.trim="form.productSpec" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="单位：">
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="预留仓库：">
            <warehous-selector :params="form" paramsKey="storeId" :defaultOpions="warehouseOpts" @selectChange="storeChange"></warehous-selector>
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

export default {
  components: {
    ProductSelector,
    WarehousSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      isEdit: false,
      form: {
        productId: '',
        count: undefined,
        text: '',
        storeId: '',

        productName: '',
        storeName: '',
        productSpec: '', // 规格
        productBarCode: '', // 条码
        productUnit: '' // 单位
      },
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      productOptions: [],
      warehouseOpts: []
    };
  },
  created() {
    if (this.item && this.item.productId) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.productOptions = [{ name: this.item.productName, productId: this.item.productId }];
      this.warehouseOpts = [{ name: this.item.storeName, id: this.item.storeId }];
    }
  },
  methods: {
    selectChange(products) {
      const p = products[0] || {};
      this.form.productName = p.name;
      this.form.productSpec = p.spec;
      this.form.productBarCode = p.barCode;
      this.form.productUnit = p.unit;
    },
    storeChange(storeList) {
      const s = storeList[0] || {};
      this.form.storeName = s.name;
    },
    confirm() {
      this.$refs.contractForm.validate((valid) => {
        if (!valid) return;
        this.$emit('success', this.form);
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
