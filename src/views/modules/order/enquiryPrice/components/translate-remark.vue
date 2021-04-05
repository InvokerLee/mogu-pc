<template>
  <el-dialog
    width="580px"
    title="采购备注翻译"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form size="mini" :model="form">
      <el-form-item label="采购确认备注：">
        <span class="font-red">{{ item.remark }}</span>
      </el-form-item>
      <el-form-item label="展示给客户查看的翻译(可直接选择已翻译的模版，如模版不适用请自行编辑翻译)：">
        <el-select class="w100" v-model="templateId" @change="templateChange">
          <el-option v-for="i in templateList" :key="i.id" :value="i.id" :label="i.cn"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="编辑翻译(只能输入英文，请注意检查拼写)："
        prop="remark"
        :rules="[
          { required: true, message: '必填', trigger: 'blur', },
          { pattern: /^[A-Za-z\s\.\,]*$/, message: '只能输入英文', trigger: 'blur' },
        ]"
      >
        <el-input
          type="textarea"
          placeholder="请输入英文"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="form.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="mini" :loading="loading" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { inquiryTranslation } from '@/api/basicData';
import { inquiryRecordTranslate } from '@/api/order';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        remark: '',
      },
      templateId: '',
      templateList: [],
    };
  },
  created() {
    this.getTemplateList();
  },
  methods: {
    getTemplateList() {
      inquiryTranslation()
        .then(({ data }) => {
          this.templateList = data;
        })
        .catch(() => {});
    },
    templateChange(id) {
      const t = this.templateList.find(v => v.id === id);
      this.form.remark = t.en;
    },
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.loading = true;
      inquiryRecordTranslate(this.item.id, this.form)
        .then(() => {
          this.$message.success('翻译成功');
          this.$emit('success');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-group {
  width: 100%;
  .radio {
    padding: 6px 0;
    display: flex;
    >>> .el-radio__label {
      white-space: normal;
    }
  }
}
</style>
