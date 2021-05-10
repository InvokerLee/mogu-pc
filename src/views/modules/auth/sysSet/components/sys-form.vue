<template>
  <el-dialog
    width="480px"
    :title="isEdit ? '修改配置' : '新增配置'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form ref="sysForm" size="mini" label-width="110px" :model="form" :rules="rules">
          <el-form-item label="公司名称：" prop="companyId">
            <el-select v-model="form.companyId" class="w100">
              <el-option v-for="i in companyList" :key="i.id" :label="i.name" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置项名称：" prop="configKey">
            <el-input v-model.trim="form.configKey"></el-input>
          </el-form-item>
          <el-form-item label="值：" prop="configValue">
            <el-input v-model.trim="form.configValue"></el-input>
          </el-form-item>
          <el-form-item label="说明：" prop="text">
            <el-input v-model.trim="form.text" type="textarea" :autosize="{ minRows: 2, maxRows:4 }">
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
import { addSys, editSys } from '@/api/auth/sysSet';
import { commonCompanyList } from '@/api/common';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      companyList: [],
      form: {
        companyId: '',
        configKey: '',
        configValue: '',
        text: ''
      },
      rules: {
        companyId: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        configKey: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        configValue: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        text: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getCommpanyList();
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      this.companyList = [{
        id: this.item.companyId,
        name: this.item.companyName
      }];
    }
  },
  methods: {
    getCommpanyList() {
      commonCompanyList().then((res) => {
        this.companyList = res.result;
      }).catch(() => {});
    },
    confirm() {
      this.$refs.sysForm.validate((valid) => {
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
        ? editSys({
          ...this.form,
          id: this.item.id
        })
        : addSys(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
