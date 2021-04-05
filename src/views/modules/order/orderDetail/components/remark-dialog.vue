<template>
  <el-dialog
    width="580px"
    :title="form.type === 1 ? '新增订单备注' : '新增发货备注'"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form
      ref="remarkForm"
      label-width="50px"
      size="mini"
      :model="form"
      :rules="rules"
      v-loading="loading"
    >
      <el-form-item label="">
        <el-checkbox-group class="checkbox-group" v-model="checkedItems" @change="checkChange">
          <el-checkbox class="item" v-for="item in remarkList" :key="item.id" :label="item.remark">{{ item.remark }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label=" " prop="remark">
        <el-input
          type="textarea"
          placeholder="请输入备注"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model.trim="form.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="saveLoading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getOrderRemarkTemplate } from '@/api/basicData';
import { addOrderRemark } from '@/api/order';

export default {
  props: ['visible', 'orderId', 'type'],
  data() {
    return {
      loading: false,
      saveLoading: false,
      checkedItems: [],
      form: {
        type: '',
        remark: '',
      },
      rules: {
        remark: [
          { required: true, message: '请填写备注', trigger: 'change' },
        ],
      },
      remarkList: [],
    };
  },
  created() {
    this.getRemarkList();
  },
  methods: {
    getRemarkList() {
      if (!this.type) return;
      this.form.type = this.type;
      const params = {
        type: this.form.type,
      };
      this.loading = true;
      getOrderRemarkTemplate(params)
        .then(({ data }) => {
          this.remarkList = data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    checkChange() {
      this.form.remark = this.checkedItems.join('；');
    },
    save() {
      this.$refs.remarkForm.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        addOrderRemark(this.orderId, this.form)
          .then(() => {
            this.$message.success('新增成功');
            this.$emit('success');
          })
          .catch(() => {})
          .finally(() => {
            this.saveLoading = false;
          });
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-group {
  width: 100%;
  .item {
    padding: 5px 0;
    display: flex;
    >>> .el-checkbox__label {
      white-space: normal;
    }
  }
}
</style>
