<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '客户编辑' : '客户新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="hqForm" size="mini" label-width="100px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="客户名称：" prop="realname">
            <el-input v-model.trim="form.realname"></el-input>
          </el-form-item>
          <el-form-item label="助记符：" prop="">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="是否结账：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="上级客户：">
            <customer-selector :params="form" paramsKey="customerId"></customer-selector>
          </el-form-item> -->
          <el-form-item label="业务员：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="单价含税：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="账期：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="付款方式：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
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
// import CustomerSelector from '@/components/CustomerSelector';
// import { addUser, editUser } from '@/api/auth/user';

export default {
  components: {
    // CustomerSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
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
    confirm() {
      this.$refs.hqForm.validate((valid) => {
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
