<template>
  <el-dialog
    width="720px"
    :title="isEdit ? '产品编辑' : '产品新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="productForm" size="mini" label-width="120px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="品名：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="条码：" prop="barCode">
            <el-input v-model.trim="form.barCode"></el-input>
          </el-form-item>
          <el-form-item label="品牌：" prop="productBrandId">
            <brand-search :params="form" paramsKey="productBrandId"></brand-search>
          </el-form-item>
          <el-form-item label="箱单位：" prop="boxUnit">
            <el-input v-model.trim="form.boxUnit"></el-input>
          </el-form-item>
          <el-form-item label="采购价：">
            <el-input-number
              v-model="form.stockPrice"
              class="w100"
              :controls="false"
              :precision="2"
              @change="getStockTaxRate"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="毛利率(%)：">
            <el-input v-model.trim="form.grossProfitRate" placeholder="自动计算" disabled></el-input>
          </el-form-item>
          <el-form-item label="进货税率(%)：" prop="stockTaxRate">
            <el-input-number
              v-model="form.stockTaxRate"
              class="w100"
              :controls="false"
              :precision="0"
              @change="getStockTaxRate"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="form.state" placeholder="请选择" class="w100">
              <el-option label="有效" :value="1" />
              <el-option label="停用" :value="0" />
              <el-option label="只退不售" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格：">
            <el-input v-model.trim="form.spec"></el-input>
          </el-form-item>
          <el-form-item label="所属类别：" prop="productTypeId">
            <category-search :params="form" paramsKey="productTypeId"></category-search>
          </el-form-item>
          <el-form-item label="单位：" prop="unit">
            <el-input v-model.trim="form.unit"></el-input>
          </el-form-item>
          <el-form-item label="箱装量：" prop="boxCount">
            <el-input-number
              v-model="form.boxCount"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="发货价：">
            <el-input-number
              v-model="form.salsePrice"
              class="w100"
              :controls="false"
              :precision="2"
              @change="salsePriceChange"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="保质期：">
            <el-input-number
              v-model="form.shelfDays"
              class="w100"
              :controls="false"
              :precision="0 "
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="发货税率(%)：" prop="salesTaxRate">
            <el-input-number
              v-model="form.salesTaxRate"
              class="w100"
              :controls="false"
              :precision="0"
              @change="getSalesTaxRate"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="发货价(未税)：">
            <el-input v-model.trim="form.salseNoTaxPrice" disabled placeholder="自动计算"></el-input>
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

import CategorySearch from '@/components/CategorySearch';
import BrandSearch from '@/components/BrandSearch';
import { addProduct, editProduct } from '@/api/config';
import calculator from '@/utils/calculator';

export default {
  components: {
    CategorySearch,
    BrandSearch
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        name: '',
        barCode: '',
        productBrandId: '',
        boxUnit: '',
        stockPrice: undefined,
        grossProfitRate: '',
        stockTaxRate: undefined,
        state: 1,
        spec: '',
        productTypeId: '',
        unit: '',
        boxCount: undefined,
        salsePrice: undefined,
        shelfDays: undefined,
        salesTaxRate: undefined,
        salseNoTaxPrice: ''
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        barCode: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        boxUnit: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        productTypeId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        boxCount: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        productBrandId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        salesTaxRate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        stockTaxRate: [
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
    }
  },
  methods: {
    confirm() {
      this.$refs.productForm.validate((valid) => {
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
        ? editProduct({ id: this.item.id, ...this.form })
        : addProduct(this.form);
    },
    cancel() {
      this.$emit('cancel');
    },
    getSalesTaxRate() {
      if (!this.form.salsePrice || !this.form.salesTaxRate) return;
      const a = calculator.times(this.form.salsePrice, this.form.salesTaxRate).divide(100).done();
      this.form.salseNoTaxPrice = calculator.minus(this.form.salsePrice, a).toFixed(2).done();
    },
    getStockTaxRate() {
      if (!this.form.stockPrice || !this.form.salsePrice) return;
      this.form.grossProfitRate = calculator.minus(this.form.salsePrice, this.form.stockPrice).divide(this.form.salsePrice).times(100).toFixed(2).done();
    },
    salsePriceChange() {
      this.getSalesTaxRate();
      this.getStockTaxRate();
    }
  }
};
</script>
