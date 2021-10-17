<template>
  <el-dialog
    width="750px"
    title="修改明细"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="itemForm" size="mini" label-width="130px" :model="form" :rules="rules">
      <el-form-item label="订单产品：" prop="realname">
        <product-selector
          :params="form"
          paramsKey="productId"
          :defaultOpions="productOpts"
          @selectChange="selectChange"
        ></product-selector>
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="发货数量：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="含税发货单价：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="未税发货单价：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="验收数量：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="含税验收单价：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="未税验收单价：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="损耗数量：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="含税成本单价：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="箱数：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="含税发货金额：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="未税发货金额：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="验收箱数：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="含税验收金额：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="未税验收金额：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="损耗箱数：">
            <el-input-number
              v-model="form.count"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="含税损耗成本：">
            <el-input v-model.trim="form.phone"></el-input>
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
// import { addUser, editUser } from '@/api/auth/user';

export default {
  components: {
    ProductSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        productId: '',
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
      },
      productOpts: []
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });

      this.productOpts = [{ name: this.item.productName, productId: this.item.productId }];
    }
  },
  methods: {
    selectChange(product) {
      console.log(product);
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
