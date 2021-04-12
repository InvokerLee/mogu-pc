<template>
  <el-dialog
    width="420px"
    :title="isEdit ? '修改角色' : '新增角色'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="roleForm" size="mini" label-width="65px" :model="form" :rules="rules">
          <el-form-item label="名称：" prop="roleName">
            <el-input v-model.trim="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows:4 }">
            </el-input>
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
import { addRole, editRole } from '@/api/auth/role';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        roleName: '',
        remark: ''
      },
      rules: {
        roleName: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    if (this.item && this.item.roleId) {
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
        ? editRole({
          ...this.form,
          roleId: this.item.roleId
        })
        : addRole(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
