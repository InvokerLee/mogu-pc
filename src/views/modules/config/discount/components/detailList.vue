<template>
  <div v-if="rowId">
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
        <el-table-column :width="60" label="操作" type="action" align="center">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around" class="font-16">
              <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
              <a class="font-red el-icon-delete" @click="del(scope.row)"></a>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="赠送产品" align="center" />
        <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
        <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
        <el-table-column :width="100" prop="taxPrice" label="含税赠品单价" align="center" />
        <el-table-column :width="100" prop="noTaxPrice" label="未税赠品单价" align="center" />
        <el-table-column :width="90" prop="limitCount" label="限量" align="center" />
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
      <detail-form
        v-if="dialog.show"
        :visible="dialog.show"
        :item="dialog.item"
        :promotionId="rowId"
        @success="actionSuccess"
        @cancel="closeDialog"
      />
    </el-card>
  </div>
</template>

<script>
import { promotionDetailList, delPromotionDetail } from '@/api/config';
import detailForm from './detail-form';
export default {
  components: {
    detailForm
  },
  props: ['rowId'],
  data() {
    return {
      loading: false,
      params: {
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
        promotionManagerId: this.rowId
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      promotionDetailList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).finally(() => {
        this.loading = false;
      });
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
      }).then(() => delPromotionDetail(item.id)).then(() => {
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
    .el-card__header, .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
