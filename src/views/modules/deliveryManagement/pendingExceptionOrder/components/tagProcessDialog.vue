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
    title="标记已处理"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="12">
          订单号：{{ params.order_no }}
        </el-col>
        <el-col :span="12">
          国内单号：{{ params.szlcsc_no }}
        </el-col>
      </el-row>
      <div class="mt20">
        异常类型：{{ params.type }}
      </div>
      <div class="mt20">
        请再次核对检查订单和商品，确认无误。<br />
        是否需要标记已处理？
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
import { markHandle } from '@/api/deliveryManagement';

export default {
  name: 'tagProcessDialog',
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
      markHandle(this.params.id).then(({ data }) => {
        this.dialog.show = false;
        this.$message.success('标记已处理成功！');
        this.cb && this.cb();
      }).finally(() => {
        this.dialog.loading = false;
      });
    },
  },
};
</script>
