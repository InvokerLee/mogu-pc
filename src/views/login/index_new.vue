<template>
  <div class="login-container">
    <div class="left">
      <div class="icp">
        ©深圳芒果科技有限公司 版权所有粤ICP备
        <a href="https://beian.miit.gov.cn/" target="__blank">18085317号-1</a>
      </div>
    </div>
    <div class="right">
      <div class="logo">
        <img :src="require('@/assets/imgs/login/logo.png')" width="35" height="35" alt="">
        <div class="logo-name">mogujie</div>
      </div>
      <p class="sub-title">this is xiao mogu</p>
      <div class="tab">
        账号登录
      </div>
      <el-form ref="accountForm" :model="loginForm" label-position="top" :rules="rules" class="form">
        <el-form-item prop="username" label="账号：">
          <el-input
            v-model.trim="loginForm.username"
            class="w280"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入登录密码"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row type="flex" align="middle">
            <el-input
              v-model="loginForm.captcha"
              style="width: 180px;"
            >
            </el-input>
            <img alt="验证码" style="flex: 1;margin-left:15px;" height="40" :src="checkCodeApi" @click="changeCheckCode">
          </el-row>
        </el-form-item>
        <el-button class="w100 login-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
    <!-- <section class="box">
      <div class="sys-info">
        <div class="logo">
          <img :src="require('@/assets/imgs/login/in.png')" alt="">
        </div>
        <div class="title">
          <div class="zh">小摩菇智慧管理系统</div>
          <div class="en">Mogu smart Management System</div>
        </div>
      </div>

    </section>
    <div class="icp">
      ©深圳芒果科技有限公司 版权所有粤ICP备
      <a href="https://beian.miit.gov.cn/" target="__blank">18085317号-1</a>
    </div> -->
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
          .catch(() => {
            this.changeCheckCode();
          })
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
  overflow: hidden;
  position: relative;

  .left {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 280px;
    background: #7f63f4;
    .icp {
      position: absolute;
      bottom: 50px;
      color: #fff;
      width: 420px;
      left: 50%;
      margin-left: -210px;
      text-align: center;
      a {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .right {
    position: absolute;
    right: 0;
    width: 280px;
    bottom: 0;
    top: 0;
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      .logo-name {
        margin-left: 15px;
        line-height: 70px;
        font-size: 26px;
        color: #7f63f4;
      }
    }
    .sub-title {
      text-align: center;
      margin: 10px 0 30px;
    }
    .tab {
      color: #7f63f4;
      border-bottom: 2px solid #7f63f4;
      padding-bottom: 12px;
      text-align: center;
    }
    .form {
      position: relative;
      overflow: hidden;
      padding: 10px 30px;

      .login-btn {
        border-radius: 50px;
        background: #7f63f4;
        color: #fff;
        border: none;
        margin-top: 16px;
      }
    }
  }

}
</style>
