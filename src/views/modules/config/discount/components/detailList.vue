<template>
  <el-card shadow="never" class="detail-list">
    <div slot="header">
      <el-tag type="info">赠品明细</el-tag>
      <span style="margin: 0 20px;">
        <el-divider direction="vertical"></el-divider>
      </span>
      <el-button size="mini" type="primary" @click="add">新增</el-button>
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
          <el-button size="mini" type="text" class="font-red" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="赠送产品" align="center" />
      <el-table-column prop="remarks" label="条码" align="center" />
      <el-table-column prop="remarks" label="单位" align="center" />
      <el-table-column prop="remarks" label="含税赠品单价" align="center" />
      <el-table-column prop="remarks" label="未税赠品单价" align="center" />
      <el-table-column prop="remarks" label="限量" align="center" />
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
    <detail-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import detailForm from './detail-form';
export default {
  components: {
    detailForm
  },
  prop: ['rowId'],
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
      tableData: [{ id: 1 }],
      dialog: {
        show: false,
        item: {}
      }
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
      this.dialog.item = {};
      this.dialog.show = true;
    },
    edit(item) {
      this.dialog.item = item;
      this.dialog.show = true;
    },
    del(item) {},
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
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
