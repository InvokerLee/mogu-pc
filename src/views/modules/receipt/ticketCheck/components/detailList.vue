<template>
  <el-card shadow="never" class="detail-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="">
          <el-tag type="info">产品明细</el-tag>
        </el-form-item>
        <el-form-item label="查询条件">
          <el-input v-model.trim="params.key" placeholder="品名/规格/条码" />
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
    >
      <el-table-column type="index" :width="55" align="center" />
      <el-table-column label="操作" type="action" :width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" class="font-red" @click="reject(scope.row)">拒收</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="产品" align="center" />
      <el-table-column prop="remarks" label="条码" align="center" />
      <el-table-column prop="remarks" label="单位" align="center" />
      <el-table-column prop="remarks" label="出库数量" align="center" />
      <el-table-column prop="remarks" label="出库箱数" align="center" />
      <el-table-column prop="remarks" label="验收数量" align="center" />
      <el-table-column prop="remarks" label="验收箱数" align="center" />
      <el-table-column prop="remarks" label="退货数量" align="center" />
      <el-table-column prop="remarks" label="退货箱数" align="center" />
      <el-table-column prop="remarks" label="损耗数量" align="center" />
      <el-table-column prop="remarks" label="含税验收单价" align="center" />
      <el-table-column prop="remarks" label="含税验收金额" align="center" />
      <el-table-column prop="remarks" label="含税成本单价" align="center" />
      <el-table-column prop="remarks" label="含税损耗成本" align="center" />
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
    <item-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import itemForm from './item-form';
export default {
  components: {
    itemForm
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
      // this.dialog.item = item;
      // this.dialog.show = true;
    },
    reject(item) {},
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
  margin-top: 3px;
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
