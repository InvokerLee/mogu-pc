<template>
  <div class="login-container">
    <section class="box">
      <div class="sys-info">
        <div class="logo">
          <img :src="require('@/assets/imgs/login/in.png')" alt="">
        </div>
        <div class="title">
          <div class="zh">小摩菇智慧管理系统</div>
          <div class="en">Mogu smart Management System</div>
        </div>
      </div>
      <el-form ref="accountForm" :model="loginForm" :rules="rules" class="form">
        <el-form-item prop="username">
          <el-input
            v-model.trim="loginForm.username"
            class="w280"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            class="w280"
            type="password"
            placeholder="请输入登录密码"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row type="flex" align="middle" class="w280">
            <el-input
              v-model="loginForm.captcha"
              style="width: 180px;"
            >
            </el-input>
            <img alt="验证码" style="flex: 1;margin-left:15px;" height="40" :src="checkCodeApi" @click="changeCheckCode">
          </el-row>
        </el-form-item>
        <el-button class="w280" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </section>
    <div class="icp">
      ©深圳芒果科技有限公司 版权所有粤ICP备
      <a href="https://beian.miit.gov.cn/" target="__blank">18085317号-1</a>
    </div>
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
        captcha: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '至少输入六位', trigger: 'blur' }
        ]
      },
      loading: false,
      redirect: undefined,
      checkCodeApi: ''

    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.changeCheckCode();
  },
  methods: {
    handleLogin() {
      this.$refs.accountForm.validate(valid => {
        if (!valid) return;
        this.loading = true;
        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            this.$router.push({ path: '/' });
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    changeCheckCode() {
      this.checkCodeApi = `${process.env.VUE_APP_BASE_API}/getVerify?s=${Math.random()}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background: url('~@/assets/imgs/login/bg.jpg') no-repeat;
  background-size: cover;
  overflow: hidden;

  .box {
    width: 100%;
    background-color: rgba(0,0,0, 0.58);
    padding: 25px 0;
    min-height: 300px;
    margin-top: 60px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .sys-info {
      display: flex;
      align-items: center;
      .logo {
          background: url('~@/assets/imgs/login/out.png') no-repeat;
          width: 80px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
      }
      .title {
        margin-left: 20px;
        .zh {
          line-height: 67px;
          font-size: 48px;
          font-weight: bold;
        }
        .en {
          line-height: 50px;
          font-size: 36px;
        }
      }
    }
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
  .icp {
    text-align: center;
    margin-top: 50px;
    a {
      color: #409eff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
