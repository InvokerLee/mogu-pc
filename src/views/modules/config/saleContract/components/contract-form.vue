<template>
  <el-dialog
    width="640px"
    :title="isEdit ? '合同编辑(主表)' : '合同新增(主表)'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="contractForm" size="mini" label-width="100px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="合同编号：">
            <el-input v-model.trim="form.contractNum" placeholder="自动生成" disabled></el-input>
          </el-form-item>
          <el-form-item label="客户：" prop="guestId">
            <customer-selector :params="form" paramsKey="guestId"></customer-selector>
          </el-form-item>
          <el-form-item label="回款账期：">
            <el-input-number
              v-model="form.backDay"
              class="w100"
              :controls="false"
              :precision="0"
              :min="1"
              :max="30"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="付款日：">
            <el-input-number
              v-model="form.payDay"
              class="w100"
              :controls="false"
              :precision="0"
              :min="1"
              :max="30"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="公司抬头：" prop="companyTital">
            <el-input v-model.trim="form.companyTital"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：" prop="state">
            <el-select v-model="form.state" placeholder="请选择" class="w100">
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="签订日期：">
            <el-date-picker
              v-model="form.signDate"
              value-format="yyyy-MM-dd"
              class="w100"
            />
          </el-form-item>
          <el-form-item label="截账日：">
            <el-input-number
              v-model="form.closeDay"
              class="w100"
              :controls="false"
              :precision="0"
              :min="1"
              :max="30"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="信用额度：">
            <el-input-number
              v-model="form.creditValue"
              class="w100"
              :controls="false"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.text"></el-input>
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
import { addSalescontract, editSalescontract } from '@/api/config';
import CustomerSelector from '@/components/CustomerSelector';

export default {
  components: {
    CustomerSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        contractNum: '',
        guestId: '',
        backDay: 1,
        payDay: 1,
        companyTital: '',
        state: 1,
        signDate: '',
        closeDay: 1,
        creditValue: undefined,
        text: ''
      },
      rules: {
        companyTital: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        guestId: [
          { required: true, message: '必选', trigger: 'blur' }
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
      return this.isEdit
        ? editSalescontract({ id: this.item.id, ...this.form })
        : addSalescontract(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
