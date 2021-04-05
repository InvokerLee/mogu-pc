<template>
  <el-dialog
    width="500px"
    :title="isEdit ? '修改用户' : '新增用户'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="userInfoForm" size="mini" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="账号：" prop="username">
            <el-input v-model.trim="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password" v-if="!isEdit">
            <el-input type="password" :maxlength="16" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="名称：" prop="realname">
            <el-input v-model.trim="form.realname"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input :maxlength="11" v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门：">
            <el-select class="w100" v-model="form.branch">
              <el-option v-for="i in branchs.itemList" :key="i.code" :label="i.name" :value="i.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="MAC地址：">
            <el-input v-model.trim="form.mac_address"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户状态：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows:4 }" v-model.trim="form.remarks">
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, editUser } from '@/api/auth/user';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        username: '',
        password: '',
        realname: '',
        phone: '',
        branch: '',
        mac_address: '',
        sex: '',
        status: 1,
        level: 0,
        remarks: '',
      },
      rules: {
        username: [
          { required: true, message: '账号必填', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{0,}$/, message: '请输字母、数字、_、@等字符，不含中文', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, message: '不少于6位', trigger: 'blur' },
        ],
        realname: [
          { required: true, message: '名称必填', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { min: 6, message: '不少于6位', trigger: 'blur' },
        ],
        sex: [
          { required: true, message: '性别必选', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '用户状态必选', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    branchs() {
      return this.$store.getters.getConstByGroup('branch');
    },
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
        ? editUser(this.item.id, this.form)
        : addUser(this.form);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
