<template>
  <div class="return-list">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="退货单号" prop="backgood_apply_no">
        <el-input class="input-width" v-model="params.backgood_apply_no"></el-input>
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
      <el-form-item label="处理方式" prop="handle_way">
        <el-select class="input-width" placeholder="请选择" v-model="params.handle_way">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in backgoodWay.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="audit_status">
        <el-select class="input-width" placeholder="请选择" v-model="params.audit_status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in refundAuditStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库状态" prop="status">
        <el-select class="input-width" placeholder="请选择" v-model="params.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in backgoodStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="created_at">
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
      <el-form-item>
        <el-button type="primary" @click="search">查找</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" @click="auditReceipt(true)">审核通过</el-button>
      <el-button type="danger" size="mini" @click="auditReceipt(false)">审核不通过</el-button>
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
        <el-table-column label="退货单号" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini">{{ scope.row.backgood_apply_no }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" width="110px">>
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="toDetail(scope.row)">{{scope.row.order_no}}</el-button> -->
            <div class="font-blue">{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customer_code" label="客户编号" align="center"></el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <div>{{ refundAuditStatus[scope.row.audit_status] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库状态" align="center">
          <template slot-scope="scope">
            <div>{{ backgoodStatus[scope.row.status] }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="apply_user_name" label="申请人" align="center"></el-table-column>
        <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="audit_user_name" label="审核人" align="center"></el-table-column>
        <el-table-column prop="audited_at" label="审核时间" align="center"></el-table-column>
        <el-table-column label="处理方式" align="center">
          <template slot-scope="scope">
            <div>{{ backgoodWay[scope.row.handle_way] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退货原因" align="center">
          <template slot-scope="scope">
            <div>{{ backgoodReason[scope.row.reason] }}</div>
          </template>
        </el-table-column>
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
      :uuid="auditDialog.uuid"
      @cancel="closeDialog"
    >
    </audit-dialog>
  </div>
</template>

<script>
import { getReturnList } from '@/api/order';
import auditDialog from './components/audit-dialog';

export default {
  name: 'returnList',
  components: {
    auditDialog,
  },
  data() {
    return {
      loading: false,
      params: {
        backgood_apply_no: '',
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        handle_way: '',
        created_at: '',
        audit_status: 1,
        status: '',
        page: 1,
        limit: 20,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      auditDialog: {
        show: false,
        isApproved: false,
        uuid: '',
      },
    };
  },
  computed: {
    backgoodWay() {
      return this.$store.getters.getConstByGroup('backgood_way');
    },
    refundAuditStatus() {
      return this.$store.getters.getConstByGroup('refund_audit_status');
    },
    backgoodReason() {
      return this.$store.getters.getConstByGroup('backgood_reason');
    },
    backgoodStatus() {
      return this.$store.getters.getConstByGroup('backgood_status');
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
      getReturnList(params).then(({ data }) => {
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
.return-list {
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
