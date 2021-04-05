<template>
  <div class="refund-list">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="退款单号" prop="refund_apply_no">
        <el-input class="input-width" v-model="params.refund_apply_no"></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="order_no">
        <el-input class="input-width" v-model="params.order_no"></el-input>
      </el-form-item>
      <el-form-item label="国内单号" prop="szlcsc_no">
        <el-input class="input-width" v-model="params.szlcsc_no"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input class="input-width" v-model="params.customer_code"></el-input>
      </el-form-item>
      <el-form-item label="支付方式" prop="pay_type">
        <el-select class="input-width" placeholder="请选择" v-model="params.pay_type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in payType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款类型" prop="type">
        <el-select class="input-width" placeholder="请选择" v-model="params.type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in refundType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态" prop="status">
        <el-select class="input-width" placeholder="请选择" v-model="params.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in refundStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款方式" prop="way">
        <el-select class="input-width" placeholder="请选择" v-model="params.way">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in refundWay.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="audit_status">
        <el-select class="input-width" placeholder="请选择" v-model="params.audit_status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in refundAuditStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$hasPermission('searchRefundList')" @click="search">{{ $hasPermission('searchRefundList') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" v-if="$hasPermission('refundAuditPass')" @click="auditRefund(true)">{{ $hasPermission('refundAuditPass') }}</el-button>
      <el-button type="danger" size="mini" v-if="$hasPermission('refundAuditFail')" @click="auditRefund(false)">{{ $hasPermission('refundAuditFail') }}</el-button>
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
        <el-table-column prop="refund_no" label="退款单号" align="center"></el-table-column>
        <el-table-column label="订单号" align="center" width="110px">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="toDetail(scope.row)">{{scope.row.order_no}}</el-button> -->
            <div class="font-blue">{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">
            <div>{{ payType[scope.row.pay_type] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <div>{{ refundAuditStatus[scope.row.audit_status] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款类型" align="center">
          <template slot-scope="scope">
            <div>{{ refundType[scope.row.type] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="实际退款金额" align="center">
          <template slot-scope="scope">
            <div>${{ scope.row.refund_amount || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column label="收取费用" align="center">
          <template slot-scope="scope">
            <div>取货费：${{ scope.row.take_fee || 0 }}</div>
            <div>其他：${{ scope.row.else_fee || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款明细" align="center">
          <template slot-scope="scope">
            <div>商品：${{ scope.row.product_refund || 0 }}</div>
            <div>运费：${{ scope.row.ship_refund || 0 }}</div>
            <div>手续费：${{ scope.row.else_refund || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款方式" align="center">
          <template slot-scope="scope">
            <div>{{ refundWay[scope.row.way] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" align="center">
          <template slot-scope="scope">
            <div>{{ refundStatus[scope.row.status] }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" align="center"></el-table-column>
        <el-table-column prop="apply_user_name" label="申请人" align="center"></el-table-column>
        <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="audit_user_name" label="审核人" align="center"></el-table-column>
        <el-table-column prop="audited_at" label="审核时间" align="center"></el-table-column>
        <el-table-column prop="audit_remark" label="审核备注" align="center" width="150px" :show-overflow-tooltip="true"></el-table-column>
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
    <audit-dialog
      v-if="auditDialog.show"
      :visible="auditDialog.show"
      :isApproved="auditDialog.isApproved"
      :item="selectItems[0]"
      @success="auditSuccess"
      @cancel="closeDialog"
    >
    </audit-dialog>
  </div>
</template>

<script>
import { getRefundApplyList } from '@/api/order';
import auditDialog from './components/audit-dialog';

export default {
  name: 'refundList',
  components: {
    auditDialog,
  },
  data() {
    return {
      loading: false,
      params: {
        refund_apply_no: '',
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        pay_type: '',
        type: '',
        status: '',
        audit_status: '',
        page: 1,
        limit: 10,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      auditDialog: {
        show: false,
        isApproved: false,
        item: {},
      },
    };
  },
  computed: {
    payType() {
      return this.$store.getters.getConstByGroup('pay_type');
    },
    refundType() {
      return this.$store.getters.getConstByGroup('refund_type');
    },
    refundStatus() {
      return this.$store.getters.getConstByGroup('refund_status');
    },
    refundWay() {
      return this.$store.getters.getConstByGroup('refund_way');
    },
    refundAuditStatus() {
      return this.$store.getters.getConstByGroup('refund_audit_status');
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
      this.loading = true;
      getRefundApplyList(params).then(({ data }) => {
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
    auditRefund(isApproved) {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return;
      }
      this.auditDialog.isApproved = isApproved;
      this.auditDialog.show = true;
    },
    auditSuccess() {
      this.getList();
      this.closeDialog();
    },
    closeDialog() {
      this.auditDialog.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.refund-list {
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
