<template>
  <div class="free-receipt">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="订单号" prop="order_no">
        <el-input class="input-width" v-model="params.order_no"></el-input>
      </el-form-item>
      <el-form-item label="国内订单号" prop="szlcsc_no">
        <el-input class="input-width" v-model="params.szlcsc_no"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input class="input-width" v-model="params.customer_code"></el-input>
      </el-form-item>
      <el-form-item label="免单类型" prop="type">
        <el-select placeholder="请选择" v-model="params.type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in freeType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select placeholder="请选择" v-model="params.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in freeStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$hasPermission('searchFreeReceipt')" @click="search">{{ $hasPermission('searchFreeReceipt') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" v-if="$hasPermission('receiptAuditPass')" @click="auditReceipt(true)">{{ $hasPermission('receiptAuditPass') }}</el-button>
      <el-button type="danger" size="mini" v-if="$hasPermission('receiptAuditFail')" @click="auditReceipt(false)">{{ $hasPermission('receiptAuditFail') }}</el-button>
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
            <!-- <el-button type="text" size="mini" @click="toDetail(scope.row)">{{scope.row.order_no}}</el-button> -->
            <div class="font-blue">{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="客户编号" align="center" width="100px">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.customer_code }}</span>
              <span v-if="scope.row.is_head" class="font-red">(头部客户)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_created_at" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="expired_date" label="支付到期时间" align="center"></el-table-column>
        <el-table-column prop="order_status_text" label="订单状态" align="center"></el-table-column>
        <el-table-column label="应收金额" align="center">
          <template slot-scope="scope">
            <div>${{ scope.row.total || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="type_text" label="免单类型" align="center"></el-table-column>
        <el-table-column prop="status_text" label="审核状态" align="center"></el-table-column>
        <el-table-column prop="by_user" label="申请人" align="center"></el-table-column>
        <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="reviewer_user" label="审核人" align="center"></el-table-column>
        <el-table-column prop="review_time" label="审核时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="免单备注" align="center" width="180px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="review_remark" label="审核备注" align="center" width="180px" :show-overflow-tooltip="true"></el-table-column>
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
import { getFreeReceipts } from '@/api/order';
import auditDialog from './components/audit-dialog';

export default {
  name: 'freeReceipt',
  components: {
    auditDialog,
  },
  data() {
    return {
      loading: false,
      params: {
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        status: '',
        type: '',
        page: 1,
        limit: 10,
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
    freeStatus() {
      return this.$store.getters.getConstByGroup('free_status');
    },
    freeType() {
      return this.$store.getters.getConstByGroup('free_type');
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
      getFreeReceipts(params).then(({ data }) => {
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
    auditReceipt(isApproved) {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return;
      }
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
  },
};
</script>

<style lang="scss" scoped>
.free-receipt {
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
