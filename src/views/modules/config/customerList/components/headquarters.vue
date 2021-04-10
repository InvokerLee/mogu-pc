<template>
  <el-card shadow="never" class="headquarters">
    <div slot="header">
      <el-form ref="searchForm" size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">总部信息</el-tag>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model.trim="params.key" placeholder="请输入客户名称/助记符" />
        </el-form-item>
        <el-form-item label="业务员">
          <el-input v-model.trim="params.key" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="客户类型">
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
      <el-table-column prop="username" label="客户名称" align="center" />
      <el-table-column prop="remarks" label="助记符" align="center" />
      <el-table-column prop="remarks" label="业务员" align="center" />
      <el-table-column prop="remarks" label="是否结账" align="center" />
      <el-table-column prop="remarks" label="单价含税" align="center" />
      <el-table-column prop="remarks" label="客户类型" align="center" />
      <el-table-column prop="remarks" label="账期" align="center" />
      <el-table-column prop="remarks" label="地址" align="center" />
      <el-table-column prop="remarks" label="电话" align="center" />
      <el-table-column prop="remarks" label="联系人" align="center" />
      <el-table-column prop="remarks" label="付款方式" align="center" />
      <el-table-column prop="remarks" label="打印模板" align="center" />
      <el-table-column prop="remarks" label="备注" align="center" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['', '有效', '停用'][scope.row.status] }}
          </span>
        </template>
      </el-table-column>
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
    <hq-add
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import hqAdd from './hq-add';
export default {
  components: {
    hqAdd
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
.headquarters {
  width: 100%;
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
