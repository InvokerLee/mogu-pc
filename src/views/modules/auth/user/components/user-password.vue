<template>
  <el-dialog
    width="420px"
    title="修改密码"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="userPwdForm" size="mini" label-width="80px" :model="form" :rules="rules">
          <el-form-item label="旧密码" prop="password">
            <el-input v-model="form.password" type="password" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editPwd } from '@/api/auth/user';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        password: '',
        newPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '6-32位密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    confirm() {
      this.$refs.userPwdForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        const params = {
          ...this.form,
          id: this.item.id
        };
        editPwd(params)
          .then(() => {
            this.$message.success('修改成功');
            this.cancel();
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
