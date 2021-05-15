<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">盘点单</el-tag>
        </el-form-item>
        <el-form-item label="盘点单号">
          <el-input v-model.trim="params.checkNum" />
        </el-form-item>
        <el-form-item label="仓库">
          <warehous-selector :params="params" paramsKey="storeId"></warehous-selector>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateRange"
            style="width: 250px;"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="已审核" :value="1" />
            <el-option label="待审核" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
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
      <el-table-column :width="120" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" align="middle">
            <a class="font-blue el-icon-edit font-16" @click.stop="edit(scope.row)"></a>
            <a class="font-red el-icon-delete font-16" @click="del(scope.row)"></a>
            <a class="font-blue" @click.stop="check(scope.row)">{{ scope.row.checkState ? '审核' : '反审' }}</a>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :width="140" prop="reserveNum" label="盘点单号" align="center" />
      <el-table-column :width="135" prop="startDate" label="盘点日期" align="center" />
      <el-table-column :width="90" prop="guestName" label="盈亏金额" align="center" />
      <el-table-column :width="90" prop="reserveCount" label="仓库" align="center" />
      <el-table-column :min-width="120" prop="text" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['已审核', '待审核'][scope.row.checkState] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="70" prop="checkUserName" label="审核人" align="center" />
      <el-table-column :width="135" prop="checkDate" label="审核时间" align="center" />
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
    <form-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import WarehousSelector from '@/components/WarehousSelector';
import { specialreserveList, checkSpecialreserve, delSpecialreserve } from '@/api/config';

import formDialog from './form-dialog';
export default {
  components: {
    WarehousSelector,
    formDialog
  },
  data() {
    return {
      loading: false,
      params: {
        checkNum: '',
        storeId: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      dateRange: [],
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
      Object.assign(params, this.formatDate(this.dateRange));
      this.loading = true;
      specialreserveList(params).then(({ result }) => {
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
      this.dateRange = [];

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
    check(item) {
      checkSpecialreserve({ id: item.id }).then(() => {
        this.$message.success('操作成功');
        this.getList();
      }).catch(() => {});
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delSpecialreserve(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
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
