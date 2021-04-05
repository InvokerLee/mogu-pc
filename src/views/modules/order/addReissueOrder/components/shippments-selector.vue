<template>
  <el-dialog
    width="360px"
    title="选择物流"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <div v-loading="loading">
      <el-select class="w100" size="mini" v-model="express_code">
        <el-option v-for="item in list" :label="item.name" :value="item.service" :key="item.uuid"></el-option>
      </el-select>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getExpressFreighttest } from '@/api/order';

export default {
  props: ['visible', 'params'],
  data() {
    return {
      loading: false,
      express_code: '',
      list: [],
    };
  },
  created() {
    this.getShippentMents();
  },
  methods: {
    getShippentMents() {
      this.loading = true;
      getExpressFreighttest(this.params).then((res) => {
        this.list = res.data;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      if (!this.express_code) {
        this.$message.warning('请选择物流');
        return;
      }
      const item = this.list.find(v => v.service === this.express_code);
      this.$emit('success', item);
    },
  },
};
</script>
