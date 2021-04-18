<template>
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
      <el-table-column prop="username" label="产品" align="center" />
      <el-table-column prop="remarks" label="规格" align="center" />
      <el-table-column prop="remarks" label="单位" align="center" />
      <el-table-column prop="remarks" label="出库数量" align="center" />
      <el-table-column prop="remarks" label="出库箱数" align="center" />
      <el-table-column prop="remarks" label="验收数量" align="center" />
      <el-table-column prop="remarks" label="验收箱数" align="center" />
      <el-table-column prop="remarks" label="退货数量" align="center" />
      <el-table-column prop="remarks" label="退货箱数" align="center" />
      <el-table-column prop="remarks" label="损耗数量" align="center" />
      <el-table-column :min-width="100" prop="remarks" label="含税验收单价" align="center" />
      <el-table-column :min-width="100" prop="remarks" label="含税验收金额" align="center" />
      <el-table-column :min-width="100" prop="remarks" label="含税成本单价" align="center" />
      <el-table-column :min-width="100" prop="remarks" label="含税损耗成本" align="center" />
      <el-table-column prop="remarks" label="税率" align="center" />
      <el-table-column prop="remarks" label="毛利额" align="center" />
      <el-table-column prop="remarks" label="毛利率" align="center" />
      <el-table-column prop="remarks" label="仓库" align="center" />
      <el-table-column prop="remarks" label="备注" align="center" />
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
export default {
  prop: ['rowId'],
  data() {
    return {
      loading: false,
      params: {
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: [{ id: 1 }]
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {

    },
    handleSizeChange(val) {
      this.params.limit = val;
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
