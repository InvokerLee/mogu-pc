<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-form ref="searchForm" hide-details size="mini" inline :model="params">
          <el-form-item label="">
            <el-tag type="info">产品明细</el-tag>
          </el-form-item>
          <el-form-item label="查询条件">
            <el-input v-model.trim="params.searchPar" placeholder="品名/规格/条码" />
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
        <el-table-column prop="productName" label="产品" align="center" />
        <el-table-column :width="80" prop="productBarCode" label="条码" align="center" />
        <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
        <el-table-column prop="outStoreCount" label="出库数量" align="center" />
        <el-table-column prop="outStoreBoxCount" label="出库箱数" align="center" />
        <el-table-column prop="checkCount" label="验收数量" align="center" />
        <el-table-column prop="checkBoxCount" label="验收箱数" align="center" />
        <el-table-column prop="returnCount" label="退货数量" align="center" />
        <el-table-column prop="returnBoxCount" label="退货箱数" align="center" />
        <el-table-column prop="damageCount" label="损耗数量" align="center" />
        <el-table-column :width="100" prop="1" label="含税验收单价" align="center" />
        <el-table-column :width="100" prop="checkTaxSum" label="含税验收金额" align="center" />
        <el-table-column :width="100" prop="1" label="含税成本单价" align="center" />
        <el-table-column :width="100" prop="1" label="含税损耗成本" align="center" />
        <el-table-column prop="taxRate" label="税率" align="center" />
        <el-table-column prop="1" label="毛利额" align="center" />
        <el-table-column prop="1" label="毛利率" align="center" />
        <el-table-column prop="storeName" label="仓库" align="center" />
        <el-table-column :min-width="200" prop="text" label="备注" align="center" />
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination py-3"
        :current-page.sync="params.curentPage"
        :page-size="params.pageSize"
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
  </div>
</template>

<script>
import { receiptOrderDetailList, rejectReceiptOrderDetail } from '@/api/receipt';
import itemForm from './item-form';

export default {
  components: {
    itemForm
  },
  props: ['rowId'],
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
      receiptOrderDetailList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
        console.log(this.tableData);
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
    edit(item) {
      // this.dialog.item = item;
      // this.dialog.show = true;
    },
    reject(item) {
      rejectReceiptOrderDetail(item.id).then(() => {
        this.$message.success('拒收成功');
        this.getList();
      }).catch(() => {});
    },
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
