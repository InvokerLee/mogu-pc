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
    title="标记入库"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="12">
          订单号：{{ params.order_no }}
        </el-col>
        <el-col :span="12">
          退货单号：<span class="bluetxt">{{ params.refund_no }}</span>
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
            prop="wait_num"
            label="待入库数量"
            align="center"
          />
          <el-table-column
            prop="already_num"
            label="已入库数量"
            align="center"
          />
          <el-table-column label="本次入库数量" align="center">
            <template slot-scope="scope">
              <div>
                <el-input v-model.trim="scope.row.wait_num" disabled />
              </div>
            </template>
          </el-table-column>
        </el-table>
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
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { markWarehouse } from '@/api/deliveryManagement';

export default {
  name: 'tagStorageDialog',
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
      markWarehouse(this.params.id).then(({ data }) => {
        this.dialog.show = false;
        this.$message.success('标记入库成功！');
        this.cb && this.cb();
      }).finally(() => {
        this.dialog.loading = false;
      });
    },
  },
};
</script>
