<template>
  <div class="fill-money-list">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="补款单号" prop="supply_apply_no">
        <el-input class="input-width" v-model="params.supply_apply_no"></el-input>
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
      <el-form-item label="审核状态" prop="audit_status">
        <el-select class="input-width" v-model="params.audit_status">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核通过" :value="2"></el-option>
          <el-option label="审核不通过" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补款类型" prop="supply_type">
        <el-select class="input-width" v-model="params.supply_type">
          <el-option label="全部" value=""></el-option>
          <el-option label="应收补款 " :value="1"></el-option>
          <el-option label="费用补款" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="pay_type">
        <el-select class="input-width" placeholder="请选择" v-model="params.pay_type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in payType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" prop="pay_status">
        <el-select class="input-width" v-model="params.pay_status">
          <el-option label="全部" value=""></el-option>
          <el-option label="待支付 " :value="1"></el-option>
          <el-option label="支付成功" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$hasPermission('searchFillMoneyList')" @click="search">{{ $hasPermission('searchFillMoneyList') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" v-if="$hasPermission('fillMoneyAuditPass')" @click="audit(true)">{{ $hasPermission('fillMoneyAuditPass') }}</el-button>
      <el-button type="danger" size="mini" v-if="$hasPermission('fillMoneyAuditFail')" @click="audit(false)">{{ $hasPermission('fillMoneyAuditFail') }}</el-button>
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
        <el-table-column prop="supply_apply_no" label="补款单号" align="center" width="110px"></el-table-column>
        <el-table-column label="补款类型" align="center">
          <template slot-scope="scope">
            <span>{{ ['', '应收补款', '费用补款'][scope.row.supply_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supply_money" label="补款金额" align="center"></el-table-column>
        <el-table-column prop="currency" label="币别" align="center"></el-table-column>
        <el-table-column label="关联单据" align="center" width="110px">
          <template slot-scope="scope">
            <div class="font-blue">{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span>{{ ['', '待审核', '审核通过', '审核不通过'][scope.row.audit_status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">
            <span>{{ payType[scope.row.pay_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" align="center">
          <template slot-scope="scope">
            <span>{{ ['', '待支付', '支付成功'][scope.row.pay_status] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="apply_user_name" label="申请人" align="center"></el-table-column>
        <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="audit_user_name" label="审核人" align="center"></el-table-column>
        <el-table-column prop="audited_at" label="审核时间" align="center"></el-table-column>
        <el-table-column prop="reason" label="补款原因" align="center"></el-table-column>
        <el-table-column prop="apply_remark" label="申请备注" align="center" width="180px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="audit_remark" label="审核备注" align="center" width="180px" :show-overflow-tooltip="true"></el-table-column>
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
      @success="auditSuccss"
      @cancel="closeDialog"
    >
    </audit-dialog>
  </div>
</template>

<script>
import { getSupplyApplyList } from '@/api/order';
import auditDialog from './components/audit-dialog';

export default {
  name: 'fillMoneyList',
  components: {
    auditDialog,
  },
  data() {
    return {
      loading: false,
      params: {
        supply_apply_no: '',
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        pay_type: '',
        supply_type: '',
        pay_status: '',
        audit_status: 1,
        page: 1,
        limit: 20,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      auditDialog: {
        show: false,
        isApproved: false,
      },
    };
  },
  computed: {
    payType() {
      return this.$store.getters.getConstByGroup('pay_type');
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
      getSupplyApplyList(params).then(({ data }) => {
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
    audit(isApproved) {
      if (!this.isSelectSingle()) return;
      this.auditDialog.isApproved = isApproved;
      this.auditDialog.show = true;
    },
    auditSuccss() {
      this.getList();
      this.closeDialog();
    },
    closeDialog() {
      this.auditDialog.show = false;
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
.fill-money-list {
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
