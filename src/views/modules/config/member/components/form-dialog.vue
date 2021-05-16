<template>
  <el-dialog
    width="720px"
    :title="isEdit ? '会员编辑' : '会员新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="productForm" size="mini" label-width="100px" :model="form" :rules="rules">

      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="生日：">
            <el-date-picker
              v-model="form.birthday"
              class="w100"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="积分：">
            <el-input v-model.trim="form.score" disabled></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="form.state" placeholder="请选择" class="w100">
              <el-option label="有效" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="注册日期：" prop="createDate">
            <el-date-picker
              v-model="form.createDate"
              class="w100"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="会员级别：" prop="vipLevel">
            <el-select v-model="form.vipLevel" placeholder="请选择" class="w100">
              <el-option label="普通会员" :value="0" />
              <el-option label="黄金会员" :value="1" />
              <el-option label="钻石会员" :value="2" />
            </el-select>
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
import { addVipuser, editVipuser } from '@/api/config';
import dayjs from 'dayjs';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        phone: '',
        birthday: '',
        score: '',
        createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        name: '',
        vipLevel: 0,
        state: 1,
        text: ''
      },
      rules: {
        phone: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '格式为数字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        vipLevel: [
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
      return this.isEdit
        ? editVipuser({ id: this.item.id, ...this.form })
        : addVipuser(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
