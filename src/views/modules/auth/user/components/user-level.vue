<template>
  <el-dialog
    width="420px"
    title="修改授权等级"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="userLevelForm" size="mini" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="授权等级：" prop="level">
        <el-radio-group v-model="form.level">
          <el-radio :label="3">高</el-radio>
          <el-radio :label="2">中</el-radio>
          <el-radio :label="1">低</el-radio>
          <el-radio :label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateLevel } from '@/api/auth/user';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        level: '',
      },
      rules: {
        level: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    if (this.item.id) {
      this.form.level = this.item.level;
    }
  },
  methods: {
    confirm() {
      this.$refs.userLevelForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        updateLevel(this.item.id, this.form)
          .then(() => {
            this.$message.success('修改成功');
            this.$emit('success');
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
