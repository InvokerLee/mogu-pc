<template>
  <div class="login-container">
    <section class="box">
      <el-form ref="accountForm" label-position="right" label-width="80px" :model="applyForm" :rules="rules" class="form">
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model.trim="applyForm.companyName"
            class="w280"
          />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input
            v-model="applyForm.phone"
            class="w280"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <el-row type="flex" align="middle" class="w280">
            <el-input
              v-model="applyForm.checkCode"
              style="width: 160px;"
            >
            </el-input>
            <img alt="验证码" style="flex: 1;margin-left:15px;" height="40" :src="checkCodeApi" @click="changeCheckCode">
          </el-row>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input
            v-model="applyForm.contactName"
            class="w280"
          />
        </el-form-item>
        <div>
          <el-button class="w280" type="primary" @click.native.prevent="handleLogin">申请</el-button>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      applyForm: {
        companyName: '',
        phone: '',
        checkCode: '',
        contactName: ''
      },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '格式为11位数字', trigger: 'blur' }
        ],
        checkCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ]
      },
      loading: false,
      checkCodeApi: ''
    };
  },
  created() {
    this.changeCheckCode();
  },
  methods: {
    changeCheckCode() {
      this.checkCodeApi = `${process.env.VUE_APP_BASE_API}/getVerify?s=${Math.random()}`;
    },
    handleLogin() {
      this.$refs.accountForm.validate(valid => {
        if (!valid) return;
        this.loading = true;
        this.$store.dispatch('user/login', this.applyForm)
          .then(() => {
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  // background: url('~@/assets/imgs/login/bg.jpg') no-repeat;
  background-size: cover;
  overflow: hidden;

  .box {
    width: 100%;
    // background-color: rgba(0,0,0, 0.5);
    min-height: 300px;
    margin-top: 60px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .form {
    position: relative;
    overflow: hidden;
    margin-top: 20px;
    text-align: center;
    .w280 {
      width: 280px;
    }
  }
}
</style>
