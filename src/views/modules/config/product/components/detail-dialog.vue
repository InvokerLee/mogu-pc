<template>
  <el-dialog
    width="500px"
    :title="isEdit ? '安全库存编辑' : '安全库存新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="safaStockForm" size="mini" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="商品：" prop="productId">
            <product-selector :params="form" paramsKey="productId"></product-selector>
          </el-form-item>
          <el-form-item label="仓库：" prop="storeId">
            <warehous-selector :params="form" paramsKey="storeId"></warehous-selector>
          </el-form-item>
          <el-form-item label="库存上限：" prop="maxValue">
            <el-input v-model.trim="form.maxValue"></el-input>
          </el-form-item>
          <el-form-item label="库存下限：" prop="minValue">
            <el-input v-model.trim="form.minValue"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ProductSelector from '@/components/ProductSelector';
import WarehousSelector from '@/components/WarehousSelector';
import { addStaff, editStaff } from '@/api/config';

export default {
  components: {
    ProductSelector,
    WarehousSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        productId: '',
        storeId: '',
        maxValue: '',
        minValue: ''
      },
      rules: {
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        storeId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        minValue: [
          { pattern: /^[0-9]*$/, message: '格式为数字', trigger: 'blur' }
        ],
        maxValue: [
          { pattern: /^[0-9]*$/, message: '格式为数字', trigger: 'blur' }
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
      this.$refs.safaStockForm.validate((valid) => {
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
        ? editStaff({
          ...this.form,
          id: this.item.id
        })
        : addStaff(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
