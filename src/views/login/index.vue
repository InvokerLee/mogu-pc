<template>
  <div class="login-container">
    <el-form ref="accountForm" class="login-form" :model="loginForm" :rules="rules">
      <div class="title-container">
        <h3 class="title">
          立创商城外贸ERP
        </h3>
      </div>
      <!-- 用户名输入框 -->
      <el-form-item prop="username">
        <el-input
          placeholder="账户名"
          v-model.trim="loginForm.username"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="密码"
          v-model="loginForm.password"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-button class="login-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '至少输入六位', trigger: 'blur' },
        ],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    handleLogin() {
      this.$refs.accountForm.validate(valid => {
        if (!valid) return;
        this.loading = true;
        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            this.$router.push({ path: this.redirect || '/' });
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: #fff;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
    .login-btn {
      width: 100%;
      margin-bottom: 30px;
    }
  }
}
</style>
