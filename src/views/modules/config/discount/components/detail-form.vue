<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '合同产品编辑(主表)' : '合同产品新增(主表)'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="itemForm" size="mini" label-width="120px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="赠送产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="options" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="单位：">
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="未税赠品单价：">
            <el-input v-model.trim="form.noTaxPrice" disabled placeholder="自动带出"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="条码">
            <el-input v-model.trim="form.productBarCode" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="含税赠品单价：">
            <el-input v-model.trim="form.taxPrice" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="限量：">
            <el-input-number
              v-model="form.limitCount"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
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
import { addPromotionDetail, editPromotionDetail } from '@/api/config';

export default {
  components: {
    ProductSelector
  },
  props: ['visible', 'item', 'promotionId'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        productId: '',
        productUnit: '',
        noTaxPrice: '',
        productBarCode: '',
        taxPrice: '',
        limitCount: undefined
      },
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      options: []
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      // 默认给一个筛选框
      this.options = [{ name: this.item.productName, productId: this.item.productId }];
    }
  },
  methods: {
    selectChange(products) {
      this.form.productBarCode = products[0].barCode;
      this.form.productUnit = products[0].unit;
      this.form.taxPrice = products[0].salsePrice;
      this.form.noTaxPrice = products[0].salseNoTaxPrice;
    },
    confirm() {
      this.$refs.itemForm.validate((valid) => {
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
        ? editPromotionDetail({ id: this.item.id, ...this.form })
        : addPromotionDetail({ promotionId: this.promotionId, ...this.form });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
