<template>
  <el-dialog
    width="500px"
    :title="isEdit ? '类别编辑' : '类别新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="categoryForm" size="mini" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="上级类别：">
            <category-search :params="form" paramsKey="parentId"></category-search>
          </el-form-item>
          <el-form-item label="类别名称：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
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
import CategorySearch from '@/components/CategorySearch';
import { addType, editType } from '@/api/config';

export default {
  components: {
    CategorySearch
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        parentId: '',
        name: '',
        state: 1,
        text: ''
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
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
      this.$refs.categoryForm.validate((valid) => {
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
        ? editType({
          id: this.item.id,
          ...this.form
        })
        : addType(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
