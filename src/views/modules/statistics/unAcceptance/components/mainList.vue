<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">未验收异常</el-tag>
        </el-form-item>
        <el-form-item label="未验收周期(天)">
          <el-input v-model.trim="params.key" placeholder="天数" class="w60px" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model.trim="params.key" placeholder="客户名称" />
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
      <el-table-column prop="username" label="单据类型" align="center" />
      <el-table-column prop="remarks" label="订单号" align="center" />
      <el-table-column prop="remarks" label="出库单号" align="center" />
      <el-table-column prop="remarks" label="验收单号" align="center" />
      <el-table-column prop="remarks" label="客户" align="center" />
      <el-table-column prop="remarks" label="出库日期" align="center" />
      <el-table-column prop="remarks" label="仓库" align="center" />
      <el-table-column prop="remarks" label="验收日期" align="center" />
      <el-table-column :min-width="110" prop="remarks" label="验收金额(含税)" align="center" />
      <el-table-column :min-width="110" prop="remarks" label="验收金额(未税)" align="center" />
      <el-table-column prop="remarks" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['停用', '有效'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="验收人" align="center" />
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
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        key: '',
        level: '',
        status: '',
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
    search() {

    },
    reset() {},
    rowChange(row) {
      this.$emit('rowClickChange', row);
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
