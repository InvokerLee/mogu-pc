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
    title="修改预报单号"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <div>预报单号默认等于批次号，只有预报时接口返回提示不能重复使用同一个预报单号时才需要修改预报单号。</div>
      <div class="mt20">
        请确认是否修改预报单号。
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
import { updateAlertNumber } from '@/api/deliveryManagement';

export default {
  name: 'forecastNumDialog',
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
      updateAlertNumber(this.params.id).then(({ data }) => {
        this.dialog.show = false;
        this.$message.success('修改预报单号成功！');
        this.cb && this.cb();
      }).finally(() => {
        this.dialog.loading = false;
      });
    },
  },
};
</script>
