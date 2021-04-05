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
    title="购买保险"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="12">
          批次号：<span class="bluetxt">{{ params.batch_no }}</span>
        </el-col>
        <el-col :span="12">
          批次总金额：{{ params.batch_total_amount }}
        </el-col>
      </el-row>
      <div class="mt20">
        物流渠道：{{ params.express_forwarder_text }}
      </div>
      <div class="mt20">
        请注意购买保险会产生额外费用，目前只有官方DHL有该项服务，一般货物价值大于等于700美金且走单票大货通道的需要购买保险。
      </div>
      <div class="mt20">
        请确认是否购买保险。
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
import { insurance } from '@/api/deliveryManagement';

export default {
  name: 'editLogisticsNumDialog',
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
      insurance(this.params.id).then(({ data }) => {
        this.dialog.show = false;
        this.$message.success('购买保险成功！');
        this.cb && this.cb();
      }).finally(() => {
        this.dialog.loading = false;
      });
    },
  },
};
</script>
