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
          <el-form-item label="产品：" prop="">
            <product-selector :params="form" paramsKey="productId" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="数量：" prop="">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="箱数：" prop="">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="税率：">
            <el-input v-model.trim="form.realname" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="仓库：" prop="">
            <warehous-selector :params="form" paramsKey="storeId"></warehous-selector>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位：">
            <el-input v-model.trim="form.realname" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="可用数量：">
            <el-input v-model.trim="form.realname" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="箱装量：">
            <el-input v-model.trim="form.realname" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="含税单价：" prop="">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="未税单价：">
            <el-input v-model.trim="form.realname" disabled placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item label="价格提示：">
            <el-input v-model.trim="form.text"></el-input>
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
// import { addUser, editUser } from '@/api/auth/user';
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
      loading: false,
      isEdit: false,
      form: {
        customerId: '',
        realname: '',
        phone: '',
        status: 1,
        remarks: ''
      },
      rules: {
        realname: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '必选', trigger: 'blur' }
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
    selectChange(product) {
      console.log(product);
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
      // return this.isEdit
      //   ? editUser(this.item.id, this.form)
      //   : addUser(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
