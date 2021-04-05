<template>
  <el-dialog
    width="420px"
    title="标记问客结束"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form ref="askedForm" size="mini" :model="form" @submit.native.prevent>
      <el-form-item label="订单号：">
        <div class="font-blue">{{ item.order_no }}</div>
      </el-form-item>
      <el-form-item label="商品编号：">
        <div>{{ item.product_number }}</div>
      </el-form-item>
      <el-form-item
        label="客户选择处理方式："
        prop="ask_handle_method"
        :rules="{ required: true, message: '请选择', trigger: 'blur' }"
      >
        <el-select v-model="form.ask_handle_method">
          <el-option v-for="i in askHandleMethod.itemList" :key="i.code" :label="i.name" :value="i.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { markAskEnd } from '@/api/order';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      form: {
        ask_handle_method: '',
      },
    };
  },
  computed: {
    askHandleMethod() {
      return this.$store.getters.getConstByGroup('ask_handle_method');
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.$refs.askedForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        markAskEnd(this.item.id, this.form).then(() => {
          this.$message.success('操作成功');
          this.$emit('success');
        }).catch(() => {}).finally(() => {
          this.loading = false;
        });
      });
    },
  },
};
</script>
