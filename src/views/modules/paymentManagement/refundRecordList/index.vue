<style lang="scss" scoped>
.refundRecordList {
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
.redtxt{
  color: #f00;
}
.bluelink{
  color: #06f;
  cursor: pointer;
}
</style>

<template>
  <div class="refundRecordList">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="退款编号" prop="refund_apply_no">
        <el-input v-model.trim="params.refund_apply_no" class="input-width" />
      </el-form-item>
      <el-form-item label="订单号" prop="order_no">
        <el-input v-model.trim="params.order_no" class="input-width" />
      </el-form-item>
      <el-form-item label="国内单号" prop="szlcsc_no">
        <el-input v-model.trim="params.szlcsc_no" class="input-width" />
      </el-form-item>
      <el-form-item label="流水号" prop="refund_serial">
        <el-input v-model.trim="params.refund_serial" class="input-width" />
      </el-form-item>
      <el-form-item label="支付方式" prop="pay_type">
        <el-select
          v-model="params.pay_type"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.pay_type"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款类型" prop="type">
        <el-select
          v-model="params.type"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.type"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款方式" prop="way">
        <el-select
          v-model="params.way"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.way"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态" prop="status">
        <el-select
          v-model="params.status"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.status"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款时间" prop="refunded_at">
        <el-date-picker
          v-model="params.refunded_at"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">
          查询
        </el-button>
        <el-button type="info" @click="reset()">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div>
      <el-button
        v-for="item in btnList"
        :key="item.id"
        :type="item.type || 'primary'"
        size="mini"
        @click="item.fn()"
      >
        {{ item.name }}
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="p-t-10">
      <el-table
        v-adaptive-height="{bottomOffset: 100}"
        v-loading="loading"
        border
        size="mini"
        height="120px"
        :data="tableData"
        @selection-change="(val) => { selectItems = val }"
      >
        <el-table-column
          prop="refund_apply_no"
          label="退款编号"
          align="center"
          width="150"
        />
        <el-table-column label="订单号" align="center" width="150">
          <template slot-scope="scope">
            <div class="bluelink" @click="toDetail(scope.row)">
              {{ scope.row.order_no }}
            </div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_type"
          label="支付方式"
          align="center"
        >
          <template slot-scope="scope">
            {{ optionList.pay_type[scope.row.pay_type] || scope.row.pay_type }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="退款类型"
          align="center"
        >
          <template slot-scope="scope">
            {{ optionList.type[scope.row.type] || scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column
          prop="refund_amount"
          label="实际退款金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>${{ scope.row.refund_amount }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="way"
          label="退款方式"
          align="center"
        >
          <template slot-scope="scope">
            {{ optionList.way[scope.row.way] || scope.row.way }}
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="原因"
          align="center"
        />
        <el-table-column
          prop="status"
          label="退款状态"
          align="center"
        >
          <template slot-scope="scope">
            <span :style="{color: scope.row.status == 2 ? '#090' : '#f00'}">
              {{ optionList.status[scope.row.status] || scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refund_serial"
          label="退款流水号"
          align="center"
        />
        <el-table-column
          prop="refunded_at"
          label="退款时间"
          align="center"
          width="150"
        />
      </el-table>

      <!-- 分页数据 -->
      <el-pagination
        v-if="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        :current-page.sync="params.page"
        :page-size.sync="params.limit"
        :total="total"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 以下写自定义弹窗 -->

  </div>
</template>

<script>
import { getRefundRecordList } from '@/api/paymentManagement';

export default {
  name: 'refundRecordList',
  components: {

  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        refund_apply_no: '',
        order_no: '',
        szlcsc_no: '',
        refund_serial: '',
        pay_type: '',
        type: '',
        way: '',
        status: '',
        refunded_at: [],
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        type: {
          1: '直接退款',
          2: '费用退款',
          3: '退货退款',
        },
        way: {
          1: '原路退回',
          2: '退至退款账户',
          3: '退至钱包',
          4: '月结退款',
        },
        status: {
          2: '成功',
          '-1': '失败',
        },
        pay_type: {
          1: '未选择',
          2: 'paypal',
          3: 'stripe',
          4: '汇款',
          7: '钱包',
          5: '月结',
          6: 'paypal快捷支付',
          8: '退款账号余额',
          9: '免单',
        },
      },

      // 操作按钮
      btnList: [
        // {id: 1, name: '预报', fn: ''},
        // {id: 2, name: '快递单', fn: '', type: 'warning'},
      ],

      // 表格数据
      tableData: [],

      // 数据总数
      total: 0,

      // 表格选中项
      selectItems: [],
    };
  },
  created() {
    if (Object.keys(this.$route.params).length) {
      Object.assign(this.params, this.$route.params);
    }
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });

      this.loading = true;
      getRefundRecordList(params).then(({ data }) => {
        this.tableData = data.data;
        this.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 查询
    search() {
      this.params.page = 1;
      this.getList();
    },
    // 重置
    reset(params) {
      this.$refs.searchForm.resetFields();
      // 如果有筛选条件，重置后添加新的条件进行搜索
      if (params) {
        Object.assign(this.params, params);
      }
      this.search();
    },

    // 页数改变时
    handleCurrentChange() {
      this.getList();
    },
    // 每页个数改变时
    handleSizeChange() {
      this.getList();
    },

    // 以下写自定义方法

    // 进入订单详情
    toDetail(row) {
      this.$router.push({ name: 'orderDetail', query: { orderId: row.order_no }});
    },
  },
};
</script>
