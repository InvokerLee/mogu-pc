<template>
  <el-card shadow="never" class="detail-list">
    <div slot="header">
      <el-tag type="info">安全库存</el-tag>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      size="mini"
      :max-height="600"
      :data="tableData"
    >
      <el-table-column label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="品名" align="center" />
      <el-table-column prop="remarks" label="规格" align="center" />
      <el-table-column prop="remarks" label="条码" align="center" />
      <el-table-column prop="remarks" label="仓库" align="center" />
      <el-table-column prop="remarks" label="库存上限" align="center" />
      <el-table-column prop="remarks" label="库存下线" align="center" />
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
    search() {

    },
    reset() {},
    add() {

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
  margin-top: 15px;
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
