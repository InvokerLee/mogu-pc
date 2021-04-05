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
          <el-form-item label="密码" prop="password">
            <el-input type="password" :maxlength="16" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" :maxlength="16" v-model="form.confirmPassword"></el-input>
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
import { resetPassword } from '@/api/auth/user';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        password: '',
        confirmPassword: '',
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '不少于6位', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('输入密码不一致'));
                return;
              }
              callback();
            },
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    confirm() {
      this.$refs.userPwdForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        const params = {
          password: this.form.password,
        };
        resetPassword(this.item.id, params)
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
    },
  },
};
</script>
