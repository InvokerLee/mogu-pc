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
            <el-select v-model="form.productId" placeholder="请选择商品" class="w100" @change="selectChange">
              <el-option v-for="i in productOptions" :key="i.productId" :label="i.productName" :value="i.productId" />
            </el-select>
          </el-form-item>
          <el-form-item label="原有数量：" prop="oldCount">
            <el-input v-model.trim="form.oldCount" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="批号：">
            <el-input v-model.trim="form.batchNum" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="盈亏数：" prop="profirCount">
            <el-input v-model.trim="form.profirCount" disabled placeholder="自动计算"></el-input>
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
import { storeDetailStoreProduct } from '@/api/warehouse';
export default {
  components: {
  },
  props: ['visible', 'item', 'storeId'],
  data() {
    return {
      isEdit: false,
      form: {
        productId: '',
        oldCount: '',
        batchNum: '',
        profirCount: '',
        currCount: undefined,

        productName: '',
        productDate: '',
        productUnit: '', // 单位
        oldCost: ''
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
        profirCount: [
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
    }
    this.getStoreProduct();
  },
  methods: {
    getStoreProduct() {
      const params = {
        storeId: this.storeId
      };
      storeDetailStoreProduct(params).then((res) => {
        this.productOptions = res.result;
      }).catch(() => {});
    },
    selectChange(pId) {
      const p = this.productOptions.find((v) => v.productId === pId);
      this.form.productName = p.productName;
      this.form.productUnit = p.productUnit;
      this.form.productDate = p.productDate; // 生产日期
      this.form.productBarCode = p.productBarCode;

      this.form.batchNum = p.batchNum;
      this.form.oldCount = p.oldCount;
      this.form.oldCost = p.oldCost;

      this.calcProfirCost();
    },
    calcProfirCost() {
      if (this.form.oldCount && this.form.currCount) {
        this.form.profirCount = Number(this.form.currCount) - Number(this.form.oldCount);
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
