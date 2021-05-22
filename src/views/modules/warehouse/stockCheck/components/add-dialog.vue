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
          <el-form-item label="产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="productOptions" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="原有数量：" prop="oldCount">
            <el-input v-model.trim="form.oldCount" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="批号：">
            <el-input v-model.trim="form.batchNum" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="盈亏数：" prop="profirCost">
            <el-input v-model.trim="form.profirCost" disabled placeholder="自动计算"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位：" prop="productUnit">
            <el-input v-model.trim="form.productUnit" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="现有数量：" prop="currCount">
            <el-input-number
              v-model="form.currCount"
              class="w100"
              :controls="false"
              :precision="0"
              @change="calcProfirCost"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="生产日期：">
            <el-input v-model.trim="form.productDate" disabled placeholder="自动带出"></el-input>
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
        oldCount: '',
        batchNum: '',
        profirCost: '',
        currCount: undefined,

        productName: '',
        productDate: '',
        productUnit: '' // 单位
      },
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        oldCount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        productUnit: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        profirCost: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        currCount: [
          { required: true, message: '必填', trigger: 'blur' }
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
      this.form.productDate = p.productDate; // 生产日期
      // 批号
      // 原有数量

      this.calcProfirCost();
    },
    calcProfirCost() {
      if (this.form.oldCount && this.form.currCount) {
        this.form.profirCost = Number(this.form.currCount) - Number(this.form.oldCount);
      }
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
