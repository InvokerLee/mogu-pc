<template>
  <el-dialog
    width="480px"
    :title="isEdit ? '菜单修改' : '菜单新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="roleForm" size="mini" label-width="95px" :model="form" :rules="rules">
          <el-form-item v-if="hasParent" label="父级菜单：">
            {{ item.parentName }}
          </el-form-item>
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单分类：" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="0">目录</el-radio>
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="功能KEY：" prop="url">
            <el-input v-model.trim="form.url"></el-input>
          </el-form-item>
          <el-form-item label="权限标识：">
            <el-input v-model.trim="form.perms"></el-input>
          </el-form-item>
          <el-form-item label="功能排序：" prop="orderNum">
            <el-input v-model.trim="form.orderNum"></el-input>
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
import { addMenu, editMenu } from '@/api/auth/permission';
import { isDef } from '@/utils';
export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        name: '',
        type: '',
        url: '',
        orderNum: '',
        perms: ''
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[A-Za-z]*$/, message: '请输入字母', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '功能排序必填', trigger: 'blur' },
          { pattern: /^\d*$/, message: '请输入数字', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    hasParent() {
      return isDef(this.item.parentId) && this.item.parentName;
    }
  },
  created() {
    if (this.item && this.item.menuId) {
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
          this.$emit('success');
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    saveForm() {
      const params = {
        ...this.form,
        parentId: this.item.parentId || 0
      };
      return this.isEdit
        ? editMenu({ ...params, menuId: this.item.menuId })
        : addMenu(params);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
