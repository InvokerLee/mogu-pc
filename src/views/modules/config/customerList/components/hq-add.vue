<template>
  <el-dialog
    width="640px"
    :title="isEdit ? '客户编辑' : '客户新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="hqForm" size="mini" label-width="100px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="客户名称：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="助记符：" prop="shortKey">
            <el-input v-model.trim="form.shortKey"></el-input>
          </el-form-item>
          <el-form-item label="是否结账：" prop="isCheck">
            <el-radio-group v-model="form.isCheck">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户类型：" prop="clientType">
            <el-select v-model="form.clientType" placeholder="请选择" class="w100">
              <el-option label="全部" value="" />
              <el-option label="正常客户" :value="0" />
              <el-option label="专柜客户" :value="1" />
              <el-option label="代配送客户" :value="2" />
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
          <!-- <el-form-item label="上级客户：">
            <customer-selector :params="form" paramsKey="customerId"></customer-selector>
          </el-form-item> -->
          <el-form-item label="业务员：">
            <staff-selector :params="form" paramsKey="bizManId" :defaultOpions="defaultOpions"></staff-selector>
          </el-form-item>
          <el-form-item label="单价含税：" prop="isTax">
            <el-radio-group v-model="form.isTax">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账期：" prop="paymentDays">
            <el-input v-model.trim="form.paymentDays"></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="付款方式：">
            <el-select v-model="form.payType" placeholder="请选择" class="w100">
              <el-option label="全部" value="" />
              <el-option label="到付" :value="0" />
              <el-option label="预付" :value="1" />
              <el-option label="月结" :value="2" />
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
import StaffSelector from '@/components/StaffSelector';
// import CustomerSelector from '@/components/CustomerSelector';

import { addGuest, editGuest } from '@/api/config';

export default {
  components: {
    StaffSelector
    // CustomerSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        name: '',
        shortKey: '',
        isCheck: 1,
        clientType: 0,
        address: '',
        contactMan: '',
        text: '',
        isTax: 1,
        paymentDays: '',
        phone: '',
        payType: 0,
        state: 1,
        bizManId: ''
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        shortKey: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        isCheck: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        clientType: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        isTax: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        paymentDays: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '格式为数字', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^[0-9]*$/, message: '格式为数字', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      defaultOpions: []
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.defaultOpions = [{
        name: this.item.bizManName,
        id: this.item.bizManId
      }];
    }
  },
  methods: {
    confirm() {
      this.$refs.hqForm.validate((valid) => {
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
        ? editGuest({
          id: this.item.id,
          ...this.form
        })
        : addGuest(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
