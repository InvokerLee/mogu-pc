<template>
  <el-dialog
    width="720px"
    :title="isEdit ? '用户编辑' : '用户新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="userInfoForm" size="mini" label-width="120px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="公司名称：" prop="companyId">
            <el-select v-model="form.companyId" class="w100" @change="companyChange">
              <el-option v-for="i in companyList" :key="i.id" :label="i.name" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号类型：" prop="accountType">
            <el-select v-model="form.accountType" class="w100">
              <el-option label="基础版" :value="0" />
              <el-option label="企业版" :value="1" />
              <el-option label="旗舰版" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="PC端访问：" prop="isPc">
            <el-select v-model="form.isPc" class="w100">
              <el-option label="是" :value="0" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="绑定微信：">
            <el-input v-model.trim="form.wechat"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-select v-model="form.state" class="w100">
              <el-option label="禁用" :value="0" />
              <el-option label="有效" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机：" prop="phone">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="有效期至" prop="validitDate">
            <el-date-picker
              v-model="form.validitDate"
              class="w100"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="APP访问：" prop="isApp">
            <el-select v-model="form.isApp" class="w100">
              <el-option label="是" :value="0" />
              <el-option label="否" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务器节点：">
            <el-input v-model.trim="form.serverNode"></el-input>
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
import { addUser, editUser } from '@/api/auth/user';
import { commonCompanyList } from '@/api/common';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      companyList: [],
      form: {
        companyId: '',
        accountType: 0,
        isPc: 0,
        wechat: '',
        state: 1,
        phone: '',
        validitDate: '',
        isApp: 0,
        serverNode: ''
      },
      rules: {
        companyId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        accountType: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        isPc: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        isApp: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '格式为11位数字', trigger: 'blur' }
        ],
        validitDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getCommpanyList();
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.companyList = [{
        id: this.item.companyId,
        name: this.item.companyName
      }];
    }
  },
  methods: {
    getCommpanyList() {
      commonCompanyList().then((res) => {
        this.companyList = res.result;
      }).catch(() => {});
    },
    confirm() {
      this.$refs.userInfoForm.validate((valid) => {
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
      return this.isEdit
        ? editUser({ id: this.item.id, ...this.form })
        : addUser(this.form);
    },
    companyChange(val) {
      const c = this.companyList.find(v => v.id === val);
      this.form.companyName = c.name;
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
