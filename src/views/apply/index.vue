<template>
  <div class="login-container">
    <section class="box">
      <el-form ref="accountForm" label-position="left" label-width="120px" :model="applyForm" :rules="rules" class="form">
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
              style="width: 180px;"
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
      </el-form>
      <div class="m-t-10">
        <el-checkbox v-model="applyForm.isAgree">
          <span>同意</span>
          <a class="link" target="_blank" :href="`${publicPath}/use-protocol.pdf`">小摩菇智慧管理平台用户协议</a>
          <a class="link" target="_blank" :href="`${publicPath}/pricy-protocol.pdf`">小摩菇智慧管理平台用户隐私政策</a>
        </el-checkbox>
      </div>
      <div style="margin-top: 20px;">
        <el-button class="w280" type="primary" @click.native.prevent="handleApply">申请</el-button>
      </div>
    </section>
    <el-dialog
      title="申请提示"
      :visible.sync="dialogVisible"
      width="640px"
    >
      <span>
        请确保贵公司为第一次申请小摩菇智慧管理平台免费使用，请填写真实的公司名称，
        后期打印模板中的公司名称以申请的公司名称为准，申请后工作人员会在24小时内核实并通过！
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" :loading="loading" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { applySave } from '@/api/auth/applyList';

export default {
  name: 'Login',
  data() {
    return {
      applyForm: {
        companyName: '',
        phone: '',
        checkCode: '',
        contactName: '',
        isAgree: ''
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
      dialogVisible: false,
      loading: false,
      checkCodeApi: ''
    };
  },
  computed: {
    publicPath() {
      return process.env.BASE_URL;
    }
  },
  created() {
    this.changeCheckCode();
  },
  methods: {
    changeCheckCode() {
      this.checkCodeApi = `${process.env.VUE_APP_BASE_API}/getVerify?s=${Math.random()}`;
    },
    handleApply() {
      this.dialogVisible = true;
    },
    confirm() {
      this.loading = true;
      applySave(this.applyForm).then((res) => {
        this.$message.success('提交成功');
      }).catch(() => {
        this.changeCheckCode();
      }).finally(() => {
        this.loading = false;
        this.dialogVisible = false;
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
  }
    .w280 {
      width: 320px;
    }
    .link {
      margin-left: 10px;
      color: #16d;
      text-decoration: underline;
    }
}
</style>
