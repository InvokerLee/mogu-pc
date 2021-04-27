<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-tag type="info">积分明细</el-tag>
        <span style="margin: 0 20px;">
          <el-divider direction="vertical"></el-divider>
        </span>
        <el-button size="mini" type="primary" @click="add">积分兑换</el-button>
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
        :current-page.sync="params.page"
        :page-size="params.limit"
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
        key: '',
        level: '',
        status: '',
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: [],
      dialog: {
        show: false
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
    .el-card__header {
        padding: 3px;
    }
    .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
