<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-tag type="info">积分明细</el-tag>
        <span style="margin: 0 20px;">
          <el-divider direction="vertical"></el-divider>
        </span>
        <el-button size="mini" type="primary" @click="openDialog">积分兑换</el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        size="mini"
        :max-height="600"
        :data="tableData"
      >
        <el-table-column prop="username" label="订单号" align="center" />
        <el-table-column prop="remarks" label="订单日期" align="center" />
        <el-table-column prop="remarks" label="订单金额" align="center" />
        <el-table-column prop="remarks" label="积分" align="center" />
        <el-table-column prop="remarks" label="备注" align="center" />
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
        @success="actionSuccess"
        @cancel="closeDialog"
      />
    </el-card>
  </div>
</template>

<script>
import { vipscoreDetailList } from '@/api/config';
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
        show: false
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
        parentId: this.rowId
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      vipscoreDetailList(params).then(({ result }) => {
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
    openDialog() {
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
