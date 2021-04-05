<style lang="scss" scoped>
.bluetxt {
  color: #06f;
}
.redtxt {
  color: #f00;
}
.mt20{
  margin-top: 20px;
}
</style>

<template>
  <el-dialog
    width="540px"
    title="查看退回商品"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="12">
          订单号：<span class="bluetxt">{{ params.order_no }}</span>
        </el-col>
        <el-col :span="12">
          国内单号：{{ params.szlcsc_no }}
        </el-col>
      </el-row>
      <div class="mt20">
        <el-table
          border
          size="mini"
          :max-height="480"
          :data="params.product_info || []"
          :header-cell-style="{backgroundColor: '#e4e4e4'}"
        >
          <el-table-column
            width="55px"
            type="index"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="product_number"
            label="商品编码"
            align="center"
          />
          <el-table-column
            prop="return_num"
            label="退回数量"
            align="center"
          />
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="dialog.show = false">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'lookReturnGoodsDialog',
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
  },
};
</script>
