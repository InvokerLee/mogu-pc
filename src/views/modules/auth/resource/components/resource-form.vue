<template>
  <el-dialog
    width="480px"
    :title="isEdit ? '修改资源' : '新增资源'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="roleForm" size="mini" label-width="65px" :model="form" :rules="rules">
          <el-form-item label="名称：" prop="resc_name">
            <el-input v-model.trim="form.resc_name"></el-input>
          </el-form-item>
          <el-form-item label="URL：" prop="url">
            <el-input v-model.trim="form.url"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="methods">
            <el-select class="w100" placeholder="请选择" v-model="form.methods">
              <el-option v-for="i in methods.itemList" :key="i.code" :label="i.name" :value="i.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows:4 }" v-model.trim="form.remark">
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
import { addResc, editResc } from '@/api/auth/resc';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        resc_name: '',
        url: '',
        methods: '',
        remark: '',
      },
      rules: {
        resc_name: { required: true, message: '名称必填', trigger: 'blur' },
        url: { required: true, message: 'url必填', trigger: 'blur' },
        methods: { required: true, message: '资源请求必选', trigger: 'blur' },
      },
    };
  },
  computed: {
    methods() {
      return this.$store.getters.getConstByGroup('methods');
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
        ? editResc(this.item.id, this.form)
        : addResc(this.form);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
