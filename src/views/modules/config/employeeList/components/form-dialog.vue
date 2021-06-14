<template>
  <el-dialog
    width="500px"
    :title="isEdit ? '职员编辑' : '职员新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="employeeForm" size="mini" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="phone">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="是否业务员" prop="isBizMan">
            <el-radio-group v-model="form.isBizMan">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.text" type="textarea" :autosize="{ minRows: 2, maxRows:4 }">
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addStaff, editStaff } from '@/api/config';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        name: '',
        phone: '',
        state: 1,
        text: '',
        isBizMan: 1 // 默认为是
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        phone: [
          { pattern: /(^(\d{3,4}-)?\d{7,8})$|^(1[3|5|7|8|9]\d{9})$/, message: '格式为电话或手机', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      }
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
      this.$refs.employeeForm.validate((valid) => {
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
        ? editStaff({
          ...this.form,
          id: this.item.id
        })
        : addStaff(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
