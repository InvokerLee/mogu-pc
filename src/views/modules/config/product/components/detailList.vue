<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-tag type="info">安全库存</el-tag>
        <span style="margin: 0 20px;">
          <el-divider direction="vertical"></el-divider>
        </span>
        <el-button type="success" size="mini" @click="add">新增</el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        size="mini"
        :max-height="600"
        :data="tableData"
      >
        <el-table-column :width="60" label="操作" type="action" align="center">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around" class="font-16">
              <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
            <!-- <a class="font-red el-icon-delete" @click="del(scope.row)"></a> -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="品名" align="center" />
        <el-table-column prop="productSpec" label="规格" align="center" />
        <el-table-column :width="80" prop="productBarCode" label="条码" align="center" />
        <el-table-column :width="80" prop="storeName" label="仓库" align="center" />
        <el-table-column prop="minValue" label="库存上限" align="center" />
        <el-table-column prop="maxValue" label="库存下线" align="center" />
      </el-table>
      <!-- <el-pagination
        v-if="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination py-3"
        :current-page.sync="params.curentPage"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[10,20,30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      /> -->
      <detail-dialog
        v-if="dialog.show"
        :visible="dialog.show"
        :item="dialog.item"
        :productId="rowId"
        @success="actionSuccess"
        @cancel="closeDialog"
      />
    </el-card>
  </div>
</template>

<script>
import { productSafeStoreList, delSafeStore } from '@/api/config';

import detailDialog from './detail-dialog';
export default {
  components: {
    detailDialog
  },
  props: ['rowId'],
  data() {
    return {
      loading: false,
      // params: {
      //   curentPage: 1,
      //   pageSize: 10
      // },
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
        // Object.assign(this.params, this.$options.data.call(this).params);
        return;
      }
      this.getList();
    }
  },
  methods: {
    getList() {
      // const params = {};
      // Object.keys(this.params).forEach((key) => {
      //   if (this.params[key] !== '') {
      //     params[key] = this.params[key];
      //   }
      // });
      this.loading = true;
      productSafeStoreList({
        productId: this.rowId
      }).then(({ result }) => {
        this.tableData = result.dataList;
        // this.total = result.totalCount;
      }).finally(() => {
        this.loading = false;
      });
    },
    // search() {
    // this.params.curentPage = 1;
    // this.getList();
    // },
    // handleSizeChange(val) {
    //   this.params.pageSize = val;
    //   this.getList();
    // },
    // handleCurrentChange() {
    //   this.getList();
    // },
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
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delSafeStore(item.id)).then(() => {
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
