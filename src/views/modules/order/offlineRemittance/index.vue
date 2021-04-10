<template>
  <div class="offline-remittance">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="订单号" prop="order_no">
        <el-input v-model="params.order_no" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="国内订单号" prop="szlcsc_no">
        <el-input v-model="params.szlcsc_no" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input v-model="params.customer_code" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="跟进人" prop="follow_by">
        <el-input v-model="params.follow_by" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="params.status" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in status.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select v-model="params.type" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in type.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否结款" prop="is_paid_done">
        <el-select v-model="params.is_paid_done" class="input-width">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" :value="2"></el-option>
          <el-option label="否" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付到期时间" prop="expired_date">
        <el-date-picker
          v-model="params.expired_date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下单时间" prop="created_at">
        <el-date-picker
          v-model="params.created_at"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('searchRemittanceOrder')" type="primary" @click="search">{{ $hasPermission('searchRemittanceOrder') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button v-if="$hasPermission('addReceipt')" type="primary" size="mini" @click="addOrder">{{ $hasPermission('addReceipt') }}</el-button>
      <el-button v-if="$hasPermission('markRemittancePay')" type="primary" size="mini" @click="markPay">{{ $hasPermission('markRemittancePay') }}</el-button>
    </div>
    <div class="m-t-10">
      <el-table
        v-adaptive-height="{bottomOffset: 100}"
        v-loading="loading"
        border
        size="mini"
        height="120px"
        :data="tableData"
        @selection-change="(val) => { selectItems = val }"
      >
        <el-table-column width="55" type="selection" align="center"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form
              size="mini"
              label-width="120px"
            >
              <el-form-item label="线下收款编号：">
                <div v-if="scope.row.payment_transfers && scope.row.payment_transfers.length">
                  <div v-for="item in scope.row.payment_transfers" :key="item.id">
                    <el-button type="text" size="mini">{{ item.code }}</el-button>
                    <span>，{{ scope.row.currency === 'USD' ? '$' : '￥' }}</span>
                    <span>{{ item.money }}</span>
                    <span>，{{ item.status_name }}</span>
                  </div>
                </div>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="补款单号：">
                <div v-if="scope.row.supply_applies && scope.row.supply_applies.length">
                  <div v-for="item in scope.row.supply_applies" :key="item.id">
                    <span>{{ item.code }}</span>
                    <span>，{{ scope.row.currency === 'USD' ? '$' : '￥' }}</span>
                    <span>{{ item.money }}</span>
                    <span>，{{ item.status_name }}</span>
                  </div>
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" width="135px">
          <template slot-scope="scope">
            <div>{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" align="center"></el-table-column>
        <el-table-column label="客户编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.customer_code }}
            <div v-if="scope.row.is_head" class="font-red">(头部客户)</div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="客户名称" align="center"></el-table-column>
        <el-table-column label="分类/最短报价有效期" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.type_name }}</div>
            <el-button v-if="$hasPermission('enquiryInfo')" type="text" size="mini" @click="watchEnquiry(scope.row)">{{ scope.row.min_inquiry }}</el-button>
            <div v-if="scope.row.showMinValidateDateTip" class="font-red">(即将失效)</div>
          </template>
        </el-table-column>
        <el-table-column prop="status_name" label="状态" align="center"></el-table-column>
        <el-table-column prop="expired_date" label="支付到期时间" align="center"></el-table-column>
        <el-table-column label="应收金额" align="center">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.currency === 'USD' ? '$' : '￥' }}</span>
              {{ scope.row.total }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收款金额" align="center">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.currency === 'USD' ? '$' : '￥' }}</span>
              {{ scope.row.paid_total }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header">
            是否结款/长短款
            <el-tooltip content="长短款：指已付金额与应收金额不对等时，客户多付记录为长款，多付金额则为正数，客户少付记录为短款，少付金额则为负数。" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div>{{ scope.row.is_paid_done ? '是' : '否' }}</div>
            <div class="font-red">{{ scope.row.overage_money }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="follow_name" label="跟进人" align="center"></el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
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
    <mark-pay
      v-if="dialog.show && dialog.name === 'MARK_PAY'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @success="markSuccess"
      @cancel="closeDialog"
    >
    </mark-pay>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { getOrderTransfer } from '@/api/order';
import markPay from './components/mark-pay';

export default {
  name: 'offlineRemittance',
  components: {
    markPay
  },
  data() {
    return {
      loading: false,
      params: {
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        follow_by: '',
        status: '',
        type: '',
        is_paid_done: '',
        expired_date: [],
        created_at: [],
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: [],
      selectItems: [],
      dialog: {
        show: false,
        name: ''
      }
    };
  },
  computed: {
    status() {
      return this.$store.getters.getConstByGroup('status');
    },
    type() {
      return this.$store.getters.getConstByGroup('type');
    }
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
      this.loading = true;
      getOrderTransfer(params).then(({ data }) => {
        this.tableData = data.data.map(v => ({
          ...v,
          showMinValidateDateTip: this.isLess2DayFromNow(v.min_inquiry)
        }));
        this.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    reset() {
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
    addOrder() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return;
      }
      if (this.selectItems[0].is_paid_done) {
        this.$message.warning('此订单已结款，不允许新增收款单');
        return;
      }
      this.$router.push(`addRemittance?order_no=${this.selectItems[0].order_no}`);
    },
    markPay() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return;
      }
      if (![5, 7].includes(this.selectItems[0].pay_type)) {
        this.$alert('只支持支付方式为月结和钱包余额的订单进行标记支付。', '异常提醒', {
          confirmButtonText: '确定'
        });
        return;
      }
      this.openDialog('MARK_PAY');
    },
    markSuccess() {
      this.closeDialog();
      this.getList();
    },
    watchEnquiry(row) {
      this.$router.push({
        path: '/order/enquiryPrice',
        query: {
          szlcsc_no: row.szlcsc_no,
          order_status: row.status_name
        }
      });
    },
    openDialog(name) {
      this.dialog.name = name;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    isLess2DayFromNow(dateStr) {
      if (!dateStr) return false;
      return dayjs().diff(dayjs(dateStr), 'day') <= 2;
    }
  }
};
</script>

<style lang="scss" scoped>
.offline-remittance {
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
