<style lang="scss" scoped>
.bluetxt {
  color: #06f;
}
.mt20{
  margin-top: 20px;
}
</style>

<template>
  <el-dialog
    width="480px"
    title="撤销预报"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="12">
          批次号：<span class="bluetxt">{{ params.batch_no }}</span>
        </el-col>
        <el-col :span="12">
          发货状态：{{ params.status_text }}
        </el-col>
      </el-row>
      <div class="mt20">
        发货员可能已打印快递单，如确认撤销预报，需通知发货员重新打单。
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="dialog.show = false">
        取消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="dialog.loading"
        @click="submitFn()"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cancelAlert } from '@/api/deliveryManagement';

export default {
  name: 'noForecastDialog',
  data() {
    return {
      // 数据暂存
      params: {},
      // 回调
      cb: null,

      // 弹窗相关
      dialog: {
        show: false,
        loading: false,

      },
    };
  },
  methods: {
    // 初始化方法
    show(params, cb) {
      this.params = params;
      this.cb = cb;

      this.dialog.show = true;

      // 以下写此弹窗初始化方法
    },

    // 提交方法
    submitFn() {
      this.dialog.loading = true;
      cancelAlert(this.params.batch_no).then(({ data }) => {
        this.dialog.show = false;
        this.$message.success('撤销预报成功！');
        this.cb && this.cb();
      }).finally(() => {
        this.dialog.loading = false;
      });
    },
  },
};
</script>
