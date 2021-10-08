<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">回单确认</el-tag>
        </el-form-item>
        <el-form-item label="单据类型">
          <el-select v-model="params.orderType" placeholder="请选择" class="w120px">
            <el-option label="全部" value="" />
            <el-option label="销售确认" value="salesConfirm" />
            <el-option label="专柜确认" value="shoppeConfirm" />
          </el-select>
        </el-form-item>
        <el-form-item label="查询条件">
          <el-input v-model.trim="params.searchPar" placeholder="订单/客户/供应商/产品" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateRange"
            style="width: 250px;"
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
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="已审核" :value="1" />
            <el-option label="待审核" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="rejectAll">整单拒收</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      size="mini"
      :max-height="600"
      :data="tableData"
      highlight-current-row
      @current-change="rowChange"
    >
      <el-table-column :width="80" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click.stop="uddateState(scope.row)">
            {{ scope.row.state === 0 ? '验收' : '取消验收' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="单据类型" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.orderType === 'salesConfirm' ? '销售确认':'专柜确认' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="145" prop="orderNo" label="订单号" align="center" />
      <el-table-column :width="145" prop="outStoreOrderNo" label="出库单号" align="center" />
      <el-table-column :width="145" prop="receiptConfirmNo" label="验收单号" align="center" />
      <el-table-column prop="guestName" label="客户" align="center" />
      <el-table-column :width="90" prop="outStoreDate" label="出库日期" align="center" />
      <el-table-column :width="80" prop="storeName" label="仓库信息" align="center" />
      <el-table-column :width="90" prop="checkDate" label="验收日期" align="center" />
      <el-table-column :width="105" prop="checkTaxSum" label="验收金额(含税)" align="center" />
      <el-table-column :width="105" prop="checkNoTaxSum" label="验收金额(未税)" align="center" />
      <el-table-column prop="text" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['待审核', '已审核'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="70" prop="checkUserName" label="验收人" align="center" />
    </el-table>
    <el-pagination
      v-if="tableData.length"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination py-3"
      :current-page.sync="params.curentPage"
      :page-size="params.pageSize"
      :total="total"
      :page-sizes="[10,20,30]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
import { receiptOrderList, receiptOrderCheck, receiptOrderAll } from '@/api/receipt';
export default {
  data() {
    return {
      loading: false,
      params: {
        orderType: '',
        searchPar: '',
        startDate: '',
        endData: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      dateRange: [],
      total: 0,
      tableData: [],
      selectedRow: {},
      dialog: {
        show: false,
        item: {}
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      Object.assign(params, this.formatDate(this.dateRange));
      this.loading = true;
      receiptOrderList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).finally(() => {
        this.loading = false;
      });
    },
    search() {
      this.params.curentPage = 1;
      this.getList();
    },
    reset() {
      this.dateRange = [];
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
    uddateState(item) {
      const params = {
        id: item.id
      };
      receiptOrderCheck(params).then((res) => {
        this.getList();
      }).catch(() => {});
    },
    rejectAll() {
      if (!this.selectedRow.id) return;
      const params = {
        id: this.selectedRow.id
      };
      receiptOrderAll(params).then((res) => {
        console.log(res);
      }).catch(() => {});
    },
    rowChange(row) {
      this.selectedRow = row;
      this.$emit('rowClickChange', row);
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.main-list {
  width: 100%;
  .pagination {
    text-align: center;
  }
  ::v-deep {
    .el-card__header, .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
