<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">促销列表</el-tag>
        </el-form-item>
        <el-form-item label="输入搜索">
          <el-input v-model.trim="params.key" placeholder="品名/规格/条码" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model.trim="params.key" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="变价属性">
          <el-select v-model="params.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
          <el-button type="primary" size="mini">导出</el-button>
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
      <el-table-column label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="客户" align="center" />
      <el-table-column prop="remarks" label="产品" align="center" />
      <el-table-column prop="remarks" label="条码" align="center" />
      <el-table-column prop="remarks" label="变价属性" align="center" />
      <el-table-column prop="remarks" label="档期" align="center" />
      <el-table-column prop="remarks" label="限量" align="center" />
      <el-table-column prop="remarks" label="开始时间" align="center" />
      <el-table-column prop="remarks" label="结束时间" align="center" />
      <el-table-column prop="remarks" label="原供价(含税)" align="center" />
      <el-table-column prop="remarks" label="现供价(含税)" align="center" />
      <el-table-column prop="remarks" label="原供价(未税)" align="center" />
      <el-table-column prop="remarks" label="现供价(未税)" align="center" />
      <el-table-column prop="remarks" label="赠品基数" align="center" />
      <el-table-column prop="remarks" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['停用', '有效'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
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
    <main-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import mainForm from './main-form';
export default {
  components: {
    mainForm
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
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
    },
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
