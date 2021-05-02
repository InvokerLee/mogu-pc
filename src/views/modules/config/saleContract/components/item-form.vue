<template>
  <el-dialog
    width="640px"
    :title="isEdit ? '合同编辑(明细表)' : '合同新增(明细表)'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="itemForm" size="mini" label-width="120px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="options" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="条码：" required>
            <el-input v-model.trim="form.productCode" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="供货价(含税)：" prop="taxPrice">
            <el-input-number
              v-model="form.taxPrice"
              class="w100"
              :controls="false"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货号">
            <el-input v-model.trim="form.goodsNum"></el-input>
          </el-form-item>
          <el-form-item label="单位：" required>
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="供货价(未税)：">
            <el-input v-model.trim="form.noTaxPrice" disabled placeholder="自动带出"></el-input>
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
import { addSalescontractDetail, editSalescontractDetail } from '@/api/config';

export default {
  components: {
    ProductSelector
  },
  props: ['visible', 'item', 'salesContractId'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        productId: '',
        productCode: '', // 条码
        taxPrice: undefined, // 供货价含税
        goodsNum: '',
        productUnit: '', // 单位
        noTaxPrice: '' // 供货价未税
      },
      options: [],
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        taxPrice: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      // 默认给一个筛选框
      this.options = [{ name: this.item.productName, productId: this.item.id }];
    }
  },
  methods: {
    selectChange(products) {
      this.form.productCode = products[0].barCode;
      this.form.productUnit = products[0].unit;
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
        ? editSalescontractDetail({ id: this.item.id, ...this.form })
        : addSalescontractDetail({ salesContractId: this.salesContractId, ...this.form });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
