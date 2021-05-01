<template>
  <el-dialog
    class="orderDialog"
    fullscreen
    :title="isEdit ? '订单编辑' : '订单新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="orderForm" size="mini" label-width="90px" :model="form" :rules="rules">
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="form.orderType" placeholder="请选择" class="w120px">
          <el-option label="全部" value="" />
          <el-option label="销售订单" value="sales" />
          <el-option label="采购订单" value="stock" />
          <el-option label="采购退货" value="stockReturn" />
          <el-option label="销售退货" value="salesReturn" />
          <el-option label="专柜销售" value="shoppeSales" />
          <el-option label="专柜要货申请" value="shoppeApply" />
          <el-option label="样品申请" value="sampleApply" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div class="m-t-10">
      <span>明细</span>
      <el-button class="m-l-10" type="success" size="mini">新增</el-button>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { addUser, editUser } from '@/api/auth/user';

export default {
  components: {
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        orderType: 'sales',
        realname: '',
        phone: '',
        status: 1,
        remarks: ''
      },
      rules: {
        orderType: [
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
      this.$refs.orderForm.validate((valid) => {
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

<style lang="scss" scoped>

</style>
