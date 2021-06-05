<template>
  <el-dialog
    width="750px"
    :title="isEdit ? '供应商编辑' : '供应商新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="supplierForm" size="mini" label-width="100px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="名称：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="单价含税：" prop="isTax">
            <el-select v-model="form.isTax" class="w100">
              <el-option :value="0" label="是"></el-option>
              <el-option :value="1" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input v-model.trim="form.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model.trim="form.contactMan"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="助记符：">
            <el-input v-model.trim="form.shortKey"></el-input>
          </el-form-item>
          <el-form-item label="账期：" prop="paymentDays">
            <el-input v-model.trim="form.paymentDays"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="付款方式：">
            <el-select v-model="form.payType" class="w100">
              <el-option :value="0" label="到付"></el-option>
              <el-option :value="1" label="预付"></el-option>
              <el-option :value="2" label="月结"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
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
import { addProvider, editProvider } from '@/api/config';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        name: '',
        isTax: 0,
        address: '',
        contactMan: '',
        text: '',
        shortKey: '',
        paymentDays: '',
        phone: '',
        payType: '',
        state: 1
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8|9]\d{9})/, message: '格式为电话或手机', trigger: 'blur' }
        ],
        paymentDays: [
          { pattern: /^[0-9]*$/, message: '格式为数字', trigger: 'blur' }
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
      this.$refs.supplierForm.validate((valid) => {
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
        ? editProvider({
          ...this.form,
          id: this.item.id
        })
        : addProvider(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
