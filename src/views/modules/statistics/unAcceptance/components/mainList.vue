<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">未验收异常</el-tag>
        </el-form-item>
        <el-form-item label="未验收周期(天)">
          <el-input v-model.trim="params.noCheckDay" placeholder="天数" class="w60px" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model.trim="params.guestName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
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
      <el-table-column :width="100" label="单据类型" align="center">
        <template slot-scope="scope">
          <span>
            {{ inOutStockTypes[scope.row.orderType] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="160" prop="orderNo" label="订单号" align="center" />
      <el-table-column :width="120" prop="orderOutStoreNo" label="出库单号" align="center" />
      <el-table-column :width="120" prop="checkNo" label="验收单号" align="center" />
      <el-table-column :min-width="120" prop="guestName" label="客户" align="center" />
      <el-table-column :width="135" prop="orderOutStoreDate" label="出库日期" align="center" />
      <el-table-column :width="90" prop="storeName" label="仓库" align="center" />
      <el-table-column :width="135" prop="checkDate" label="验收日期" align="center" />
      <el-table-column :min-width="120" prop="checkTaxSum" label="验收金额(含税)" align="center" />
      <el-table-column :min-width="120" prop="checkNoTaxSum" label="验收金额(未税)" align="center" />
      <el-table-column :min-width="120" prop="text" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['停用', '有效'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="70" prop="checkUserName" label="验收人" align="center" />
    </el-table>
    <el-pagination
      v-if="tableData.length"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination py-3"
      :current-page.sync="params.page"
      :page-size="params.limit"
      :total="total"
      :page-sizes="[10,20,30]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
import { reportNoCheck } from '@/api/statistics';

export default {
  data() {
    return {
      loading: false,
      params: {
        guestName: '',
        noCheckDay: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  computed: {
    inOutStockTypes() {
      return this.$store.getters.getConstByKey('inOutStockType');
    }
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
      this.loading = true;
      reportNoCheck(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    search() {
      this.params.curentPage = 1;
      this.getList();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
    rowChange(row) {
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
