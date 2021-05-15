<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-tag type="info">产品明细</el-tag>
      </div>
      <el-table
        v-loading="loading"
        border
        size="mini"
        :max-height="600"
        :data="tableData"
      >
        <el-table-column type="index" label="序号" :width="55" align="center" />
        <el-table-column :min-width="120" prop="productName" label="产品" align="center" />
        <el-table-column :min-width="100" prop="productSpec" label="规格" align="center" />
        <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
        <el-table-column :width="70" prop="taxRate" label="税率" align="center" />
        <el-table-column :width="90" prop="inStoreCount" label="入库数量" align="center" />
        <el-table-column :width="90" prop="boxCount" label="入库箱数" align="center" />
        <el-table-column :width="90" prop="taxPrice" label="含税单价" align="center" />
        <el-table-column :width="90" prop="noTaxPrice" label="未税单价" align="center" />
        <el-table-column :min-width="90" prop="" label="含税箱单价" align="center" />
        <el-table-column :min-width="90" prop="" label="未税箱单价" align="center" />
        <el-table-column :min-width="110" prop="taxSum" label="含税入库金额" align="center" />
        <el-table-column :min-width="110" prop="noTaxSum" label="未税入库金额" align="center" />
        <el-table-column :width="90" prop="storeName" label="仓库" align="center" />
        <el-table-column :min-width="120" prop="text" label="备注" align="center" />
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
  </div>
</template>

<script>
import { reportReturnNoComeInDetail } from '@/api/statistics';

export default {
  props: ['rowId'],
  data() {
    return {
      loading: false,
      params: {
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  watch: {
    rowId(val) {
      if (!val) {
        Object.assign(this.params, this.$options.data.call(this).params);
        return;
      }
      this.getList();
    }
  },
  methods: {
    getList() {
      const params = {
        orderId: this.rowId
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      reportReturnNoComeInDetail(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).finally(() => {
        this.loading = false;
      });
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
.detail-list {
  width: 100%;
  margin-top: 3px;
  .pagination {
    text-align: center;
  }
  ::v-deep {
    .el-card__header {
      padding: 3px;
    }
    .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
