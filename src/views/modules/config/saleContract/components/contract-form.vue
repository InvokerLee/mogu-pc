<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '合同编辑(主表)' : '合同新增(主表)'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="contractForm" size="mini" label-width="100px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="合同编号：" prop="realname">
            <el-input v-model.trim="form.realname"></el-input>
          </el-form-item>
          <el-form-item label="客户：" prop="">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="回款账期：">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="0"
              :min="0"
              :max="30"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="付款日：">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="0"
              :min="0"
              :max="30"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="公司抬头：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">
            <el-select v-model="form.status" placeholder="请选择" class="w100">
              <el-option label="有效" :value="1" />
              <el-option label="停用" :value="2" />
              <el-option label="只退不售" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="签订日期：">
            <el-date-picker
              v-model="form.date"
              class="w100"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="结账日：">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="0"
              :min="0"
              :max="30"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="信用额度：">
            <el-input-number
              v-model="form.quantity"
              class="w100"
              :controls="false"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.phone"></el-input>
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
// import { addUser, editUser } from '@/api/auth/user';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        realname: '',
        phone: '',
        status: 1,
        remarks: ''
      },
      rules: {
        realname: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        status: [
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
      this.$refs.contractForm.validate((valid) => {
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
