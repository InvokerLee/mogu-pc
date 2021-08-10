<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-form ref="searchForm" hide-details size="mini" inline :model="params">
          <el-form-item label="">
            <el-tag type="info">产品明细</el-tag>
          </el-form-item>
          <el-form-item label="查询条件">
            <el-input v-model.trim="params.searchPar" placeholder="名称/规格/条码" />
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
        <el-table-column type="index" label="序号" :width="55" align="center" />
        <el-table-column :width="60" label="操作" type="action" align="center">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around" class="font-16">
              <el-button type="text" :disabled="disabled" icon="el-icon-edit" @click.stop="edit(scope.row)"></el-button>
              <el-button type="text" :disabled="disabled" icon="el-icon-delete" class="font-red" @click.stop="del(scope.row)"></el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品" align="center" />
        <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
        <el-table-column :min-width="100" prop="batchNum" label="批号" align="center" />
        <el-table-column :width="135" prop="productDate" label="生产日期" align="center" />
        <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
        <el-table-column :width="90" prop="oldCount" label="原有数量" align="center" />
        <el-table-column :width="90" prop="currCount" label="现有数量" align="center" />
        <el-table-column :width="90" prop="profirCount" label="盈亏数" align="center" />
        <el-table-column :min-width="120" prop="oldCost" label="原数量成本额" align="center" />
        <el-table-column :min-width="120" prop="currCost" label="现数量成本额" align="center" />
        <el-table-column :min-width="120" prop="profirCost" label="盈亏成本额" align="center" />
        <el-table-column :min-width="120" prop="text" label="备注" align="center" />
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
    </el-card>
    <add-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      :storeId="dialog.item && dialog.item.storeId"
      @success="actionSuccess"
      @cancel="closeDialog"
    ></add-dialog>
  </div>
</template>

<script>
import { getStorecheckdetailList, delStorecheckdetail, editStorecheckdetail } from '@/api/warehouse';
import addDialog from './add-dialog';

export default {
  components: {
    addDialog
  },
  props: ['rowId', 'rowState'],
  data() {
    return {
      loading: false,
      params: {
        searchPar: '',
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
  computed: {
    disabled() {
      return this.rowState === 1;
    }
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
      getStorecheckdetailList(params).then(({ result }) => {
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
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    edit(item) {
      this.dialog.item = item;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess(item) {
      editStorecheckdetail(item).then(() => {
        this.$message.success('修改成功');
        this.getList();
      }).catch(() => {}).finally(() => {
        this.closeDialog();
      });
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delStorecheckdetail(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
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
