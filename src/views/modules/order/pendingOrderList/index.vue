<template>
  <div class="pending-order-list">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="订单号" prop="order_no">
        <el-input class="input-width" v-model="params.order_no"></el-input>
      </el-form-item>
      <el-form-item label="国内单号" prop="szlcsc_no">
        <el-input class="input-width" v-model="params.szlcsc_no"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input class="input-width" v-model="params.customer_code"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="product_number">
        <el-input class="input-width" v-model="params.product_number"></el-input>
      </el-form-item>
      <el-form-item label="挂单状态" prop="status">
        <el-select class="input-width" placeholder="请选择" v-model="params.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in delayListDelayStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂单原因" prop="reason">
        <el-select class="input-width" placeholder="请选择" v-model="params.reason">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in delayReason.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服处理状态" prop="ask_status">
        <el-select class="input-width" placeholder="请选择" v-model="params.ask_status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in askStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服选择处理方式" prop="ask_handle_method">
        <el-select class="input-width" placeholder="请选择" v-model="params.ask_handle_method">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in askHandleMethod.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂单时间" prop="created_at">
        <el-date-picker
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
          v-model="params.created_at"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="is_ask">
        <el-checkbox v-model="params.is_ask">拦截中</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$hasPermission('searchPendingOrderList')" @click="search">{{ $hasPermission('searchPendingOrderList') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" v-if="$hasPermission('markAsking')" @click="markToAsk">{{ $hasPermission('markAsking') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('markAskEnd')" @click="markAsked">{{ $hasPermission('markAskEnd') }}</el-button>
    </div>
    <div class="m-t-10">
      <el-table
        border
        size="mini"
        height="120px"
        v-adaptive-height="{bottomOffset: 100}"
        v-loading="loading"
        :data="tableData"
        @selection-change="(val) => { selectItems = val }"
      >
        <el-table-column width="55" type="selection" align="center"></el-table-column>
        <el-table-column label="订单号" align="center" width="110px">
          <template slot-scope="scope">
            <div class="font-blue">{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customer_code" label="客户编号" align="center"></el-table-column>
        <el-table-column prop="product_number" label="商品编号" align="center"></el-table-column>
        <el-table-column label="厂商型号/品牌" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.product_mpn }}</div>
            <div>{{ scope.row.brand }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="订购数量" align="center"></el-table-column>
        <el-table-column prop="delay_stock" label="挂单时库存数量" align="center"></el-table-column>
        <el-table-column prop="created_at" label="挂单时间" align="center"></el-table-column>
        <el-table-column prop="status_text" label="挂单状态" align="center"></el-table-column>
        <el-table-column prop="warehouse_text" label="仓库" align="center"></el-table-column>
        <el-table-column prop="reason_text" label="挂单原因" align="center"></el-table-column>
        <el-table-column prop="remark" label="挂单备注" align="center" width="150px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="is_ask_text" label="是否问客处理" align="center"></el-table-column>
        <el-table-column prop="ask_status_text" label="客服处理状态" align="center"></el-table-column>
        <el-table-column prop="ask_handle_method_text" label="客户处理方式" align="center"></el-table-column>
        <el-table-column prop="by_user" label="处理人" align="center"></el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        v-if="tableData.length"
        class="pagination"
        :current-page.sync="params.page"
        :page-size="params.limit"
        :total="total"
        :page-sizes="[10,20,30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <mark-asked
      v-if="dialog.show"
      :visible="dialog.show"
      :item="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </mark-asked>
  </div>
</template>

<script>
import { getDelaysList, markAsking } from '@/api/order';
import markAsked from './components/mark-asked';

export default {
  name: 'pendingOrderList',
  components: {
    markAsked,
  },
  data() {
    return {
      loading: false,
      params: {
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        product_number: '',
        reason: '',
        status: 1,
        ask_status: '',
        ask_handle_method: '',
        is_ask: true,
        created_at: [],
        page: 1,
        limit: 20,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      dialog: {
        show: false,
      },
    };
  },
  computed: {
    askStatus() {
      return this.$store.getters.getConstByGroup('ask_status');
    },
    delayReason() {
      return this.$store.getters.getConstByGroup('delay_reason');
    },
    askHandleMethod() {
      return this.$store.getters.getConstByGroup('ask_handle_method');
    },
    delayListDelayStatus() {
      return this.$store.getters.getConstByGroup('delay_list_delay_status');
    },
  },
  created() {
    this.getList();
  },
  methods: {
    search() {
      this.params.page = 1;
      this.getList();
    },
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      params.is_ask = params.is_ask ? 2 : 1;
      this.loading = true;
      getDelaysList(params).then(({ data }) => {
        this.tableData = data.data;
        this.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    reset(params) {
      this.$refs.searchForm.resetFields();
      this.search();
    },
    handleCurrentChange() {
      this.getList();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.getList();
    },
    markToAsk() {
      if (!this.isSelectSingle()) return;
      markAsking(this.selectItems[0].id)
        .then(() => {
          this.$message.success('操作成功');
          this.getList();
        }).catch(() => {});
    },
    markAsked() {
      if (!this.isSelectSingle()) return;
      this.dialog.show = true;
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
    },
    closeDialog() {
      this.dialog.show = false;
    },
    isSelectSingle() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.pending-order-list {
  width: 100%;
  padding: 20px;
  .input-width {
    width: 150px;
  }
  .pagination {
    text-align: center;
    margin: 20px 0;
  }
}
</style>
