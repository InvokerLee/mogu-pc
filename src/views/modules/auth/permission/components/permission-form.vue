<template>
  <el-dialog
    width="480px"
    :title="isEdit ? '修改功能' : '新增功能'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="roleForm" size="mini" label-width="95px" :model="form" :rules="rules">
          <el-form-item label="目录层级：">
            {{ parentListText }}
          </el-form-item>
          <el-form-item label="功能名称：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="功能KEY：" prop="route">
            <el-input v-model.trim="form.route"></el-input>
          </el-form-item>
          <el-form-item label="功能排序：" prop="sort">
            <el-input v-model.trim="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="功能等级：" prop="auth_level">
            <el-radio-group v-model="form.auth_level">
              <el-radio :label="1">低</el-radio>
              <el-radio :label="2">中</el-radio>
              <el-radio :label="3">高</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="功能描述：">
            <el-input v-model.trim="form.remarks"></el-input>
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
import { addPermission, editPermission } from '@/api/auth/permission';

export default {
  props: ['visible', 'parentListText', 'pid', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        name: '',
        route: '',
        sort: '',
        auth_level: '',
        remarks: '',
      },
      rules: {
        name: [
          { required: true, message: '功能名称必填', trigger: 'blur' },
        ],
        route: [
          { required: true, message: '功能KEY必填', trigger: 'blur' },
          { pattern: /^[A-Za-z\_\-]*$/, message: '请输入字母、_、-', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '功能排序必填', trigger: 'blur' },
          { pattern: /^\d*$/, message: '请输入数字', trigger: 'blur' },
        ],
        auth_level: [
          { required: true, message: '功能等级必选', trigger: 'blur' },
        ],
      },
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
      this.$refs.roleForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.saveForm().then((res) => {
          this.$message.success('保存成功');
          this.$emit('success', {
            node: res.data,
            isEdit: this.isEdit,
          });
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    saveForm() {
      const params = {
        pid: this.pid,
        ...this.form,
      };
      return this.isEdit
        ? editPermission(this.item.id, params)
        : addPermission(params);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
