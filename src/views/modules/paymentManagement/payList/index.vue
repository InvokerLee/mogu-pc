<style lang="scss" scoped>
.payList {
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
  <div class="payList">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="业务编号" prop="order_no">
        <el-input v-model.trim="params.order_no" class="input-width" />
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input v-model.trim="params.customer_code" class="input-width" />
      </el-form-item>
      <el-form-item label="交易流水号" prop="transaction_id">
        <el-input v-model.trim="params.transaction_id" class="input-width" />
      </el-form-item>
      <el-form-item label="支付方式" prop="method">
        <el-select
          v-model="params.method"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.method"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="type">
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
      <el-form-item label="支付状态" prop="status">
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
      <el-form-item label="支付时间" prop="paid_at">
        <el-date-picker
          v-model="params.paid_at"
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
        <el-table-column label="业务编号" align="center">
          <template slot-scope="scope">
            <div
              v-if="scope.row.type == 1"
              class="bluelink"
              @click="toDetail(scope.row)"
            >
              {{ scope.row.order_no }}
            </div>
            <div v-else>
              {{ scope.row.order_no }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer_code"
          label="客户编号"
          align="center"
        />
        <el-table-column
          prop="type"
          label="业务类型"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ optionList.type[scope.row.type] || scope.row.type }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="method"
          label="支付方式"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ optionList.method[scope.row.method] || scope.row.method }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="支付金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              ${{ scope.row.amount }}
            </div>
            <div v-if="scope.row.method === 3">HK${{ scope.row.Hkamount }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_fee_value"
          label="手续费"
          align="center"
        >
          <template slot-scope="scope">
            <div><span v-if="scope.row.method === 3">HK</span>${{ scope.row.transaction_fee_value }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="transaction_id"
          label="交易流水号"
          align="center"
        />
        <el-table-column
          prop="status"
          label="支付状态"
          align="center"
        >
          <template slot-scope="scope">
            <div :style="{color: scope.row.status == 2 ? '#090' : '#f00'}">
              {{ optionList.status[scope.row.status] || scope.row.status }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="paid_at"
          label="支付时间"
          align="center"
        />
        <el-table-column
          prop="error"
          label="异常原因"
          align="center"
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
import { paymentRecordsList } from '@/api/paymentManagement';

export default {
  name: 'payList',
  components: {

  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        order_no: '',
        customer_code: '',
        transaction_id: '',
        method: '',
        type: '',
        status: '',
        paid_at: [],
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        method: {
          1: '未选择',
          2: 'PayPal',
          3: 'Stripe',
          4: '线下汇款',
          5: '月结',
          6: '优惠券',
          7: 'paypal快捷支付',
          8: '钱包',
        },
        type: {
          1: '订单',
        },
        status: {
          1: '创建付款',
          2: '支付完成',
          3: '部分退款',
          4: '全额退款',
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
      paymentRecordsList(params).then(({ data }) => {
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
