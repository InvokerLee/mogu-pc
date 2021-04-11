<template>
  <el-dialog
    width="720px"
    title="会员设置"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-table
      border
      size="mini"
      :max-height="300"
      :data="tableData"
    >
      <el-table-column prop="username" label="会员级别" width="150px" align="center" />
      <el-table-column prop="username" label="级别名称" align="center" />
      <el-table-column prop="username" label="级别积分范围" align="center">
        <template>
          <div>
            <el-input-number
              v-model="form.quantity"
              size="mini"
              style="width: 100px;"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
            <span style="margin: 0 15px;">-</span>
            <el-input-number
              v-model="form.quantity"
              size="mini"
              style="width: 100px;"
              :controls="false"
              :precision="0"
            >
            </el-input-number>

          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 10px 0;">
      积分兑换现金设置
    </div>
    <div style="text-align: center;">
      每
      <el-input-number
        v-model="form.quantity"
        size="mini"
        style="width: 100px;margin: 0 20px;"
        :controls="false"
        :precision="0"
      >
      </el-input-number>
      积分兑换人民币1元
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { addUser, editUser } from '@/api/auth/user';

export default {
  props: ['visible'],
  data() {
    return {
      loading: false,
      form: {
        quantity: '',
        remarks: ''
      },
      rules: {
        realname: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      tableData: [{}]
    };
  },
  created() {

  },
  methods: {
    confirm() {
      this.$refs.productForm.validate((valid) => {
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
      // return this.isEdit
      //   ? editUser(this.item.id, this.form)
      //   : addUser(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
