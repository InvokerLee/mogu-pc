<style lang="scss" scoped>
.remitOrderIncomeList {
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
  <div class="remitOrderIncomeList">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="线下收款编号" prop="code">
        <el-input v-model.trim="params.code" class="input-width" />
      </el-form-item>
      <el-form-item label="跟进人" prop="follow_by_id">
        <el-input v-model.trim="params.follow_by_id" class="input-width" />
      </el-form-item>
      <el-form-item label="客户编号/名称" prop="customer">
        <el-input v-model.trim="params.customer" class="input-width" />
      </el-form-item>
      <el-form-item label="流水号" prop="transaction_no">
        <el-input v-model.trim="params.transaction_no" class="input-width" />
      </el-form-item>
      <el-form-item label="关联订单号" prop="order_no">
        <el-input v-model.trim="params.order_no" class="input-width" />
      </el-form-item>
      <el-form-item label="到账日期" prop="transfer_at">
        <el-date-picker
          v-model="params.transfer_at"
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
      <el-form-item label="收款状态" prop="status">
        <el-select
          v-model="params.status"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="v in optionList.status"
            :key="v.code"
            :label="v.name"
            :value="v.code"
          />
        </el-select>
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
        <el-table-column label="线下收款编号" align="center" width="150">
          <template slot-scope="scope">
            <div class="bluelink" @click="toReceiptDetail(scope.row)">
              {{ scope.row.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收款状态" align="center">
          <template slot-scope="scope">
            <div :class="{redtxt: scope.row.status === 1}">{{ scope.row.statusName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户编号/名称" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.customer_code }}</div>
            <div>{{ scope.row.customer_username }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remitter_name"
          label="汇款人名称"
          align="center"
        />
        <el-table-column
          prop="money_remitter"
          label="汇款金额"
          align="center"
        />
        <el-table-column
          prop="money_fee"
          label="手续费"
          align="center"
        />
        <el-table-column
          prop="money_receive"
          label="实际到账金额"
          align="center"
        />
        <el-table-column
          prop="currency"
          label="币种"
          align="center"
        />
        <el-table-column
          prop="transaction_no"
          label="流水号"
          align="center"
          width="150"
        />
        <el-table-column
          prop="created_at"
          label="创建日期"
          align="center"
          width="150"
        />
        <el-table-column
          prop="transfer_at"
          label="到账日期"
          align="center"
          width="150"
        />
        <el-table-column label="关联订单号" align="center" width="150">
          <template slot-scope="scope">
            <div v-for="item in scope.row.order_infos" class="bluelink" @click="toDetail({order_no: item})" :key="item">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="follow_by"
          label="跟进人"
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
import { paymentTransferList } from '@/api/paymentManagement';

export default {
  name: 'remitOrderIncomeList',
  components: {

  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        code: '',
        follow_by_id: '',
        customer: '',
        transaction_no: '',
        order_no: '',
        status: 1,
        transfer_at: [],
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        status: [],
      },

      // 操作按钮
      btnList: [
        // { id: 1, name: '作废', fn: this.voidFn, type: 'warning' },
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
      paymentTransferList(params).then(({ data }) => {
        this.tableData = data.data;
        this.total = data.total;

        // 获取搜索下拉
        this.optionList.status = data.count;
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

    // 作废
    // voidFn() {
    //   if (!this.selectItems.length) {
    //     this.$message.warning('请选择数据！');
    //     return;
    //   }
    // },

    // 进入订单详情
    toDetail(row) {
      this.$router.push({ name: 'orderDetail', query: { orderId: row.order_no }});
    },

    // 进入收款单详情
    toReceiptDetail(row) {
      this.$router.push({ name: 'receiptDetail', query: { id: row.id }});
    },
  },
};
</script>
