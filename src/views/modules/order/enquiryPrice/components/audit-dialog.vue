<template>
  <el-dialog
    width="400px"
    :title="stepInfo[step].title"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <div v-if="step === 0">
      该订单有未翻译的采购备注，请留意是否需要翻译。
      <el-row class="action" type="flex" justify="space-around">
        <el-button size="mini" type="text" @click="cancel">我再看看</el-button>
        <el-button size="mini" type="text" @click="nextStep">不用翻译，直接发送询价结果</el-button>
      </el-row>
    </div>
    <div v-else>
      请确认报价信息无误，发送询价结果后不可再变更报价。
      <el-row style="margin-top: 30px;" type="flex" justify="end">
        <el-button size="mini" type="primary" :loading="loading" @click="confirm">确认</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { inquiryConfirmOrder } from '@/api/order';

export default {
  props: ['visible', 'untranslated', 'szlcscNo'],
  data() {
    return {
      loading: false,
      step: 0,
      stepInfo: [
        { title: '采购备注未翻译提醒' },
        { title: '通知客户查看询价结果' },
      ],
    };
  },
  created() {
    if (this.untranslated) return;
    this.nextStep();
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    nextStep() {
      this.step = 1;
    },
    confirm() {
      this.loading = true;
      inquiryConfirmOrder(this.szlcscNo)
        .then(() => {
          this.$message.success('审核成功');
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
.action {
  width: 250px;
  margin: 30px auto 0;
}
</style>
