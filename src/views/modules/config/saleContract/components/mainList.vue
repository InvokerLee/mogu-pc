<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">销售合同</el-tag>
        </el-form-item>
        <el-form-item label="合同号">
          <el-input v-model.trim="params.contractNum" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model.trim="params.guestName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
          <el-button type="primary" size="mini" @click="download">导出</el-button>
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
      <el-table-column :width="60" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" class="font-16">
            <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
            <!-- <a class="font-red el-icon-delete" @click="del(scope.row)"></a> -->
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="contractNum" label="合同编号" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['启用', '停用'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="guestName" label="客户" align="center" />
      <el-table-column :width="90" prop="signDate" label="签订日期" align="center" />
      <el-table-column :width="70" prop="backDay" label="回款账期" align="center" />
      <el-table-column :width="70" prop="closeDay" label="截账日" align="center" />
      <el-table-column :width="70" prop="payDay" label="付款日" align="center" />
      <el-table-column prop="creditValue" label="信用额度" align="center" />
      <el-table-column prop="companyTital" label="公司抬头" align="center" />
      <el-table-column prop="text" label="备注" align="center" />
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
    <contract-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import { salescontractList, delSalescontract } from '@/api/config';

import contractForm from './contract-form';
export default {
  components: {
    contractForm
  },
  data() {
    return {
      loading: false,
      params: {
        contractNum: '',
        guestName: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
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
      this.loading = true;
      salescontractList(params).then(({ result }) => {
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
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
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
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delSalescontract(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    download() {
      this.$download('/salescontract/export', { ...this.params });
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
