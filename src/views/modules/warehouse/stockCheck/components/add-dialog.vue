<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '盘点单产品编辑' : '盘点单产品新增'"
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
            <el-input v-model.trim="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格：">
            <el-input v-model.trim="form.productSpec" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="单位：">
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
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

export default {
  components: {
    ProductSelector
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
        productUnit: '' // 单位
      },
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      productOptions: []
    };
  },
  created() {
    if (this.item && this.item.productId) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.productOptions = [{ name: this.item.productName, productId: this.item.productId }];
    }
  },
  methods: {
    selectChange(products) {
      const p = products[0] || {};
      this.form.productName = p.name;
      this.form.productUnit = p.unit;
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
