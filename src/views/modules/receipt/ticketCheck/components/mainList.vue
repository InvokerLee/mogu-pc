<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">回单确认</el-tag>
        </el-form-item>
        <el-form-item label="单据类型">
          <el-select v-model="params.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="查询条件">
          <el-input v-model.trim="params.key" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="日期" prop="paid_time">
          <el-date-picker
            v-model="params.paid_time"
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
          <el-button type="success" size="mini">整单拒收</el-button>
        </el-form-item>z
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
          <el-button size="mini" type="text" @click="uddateState(scope.row)">取消验收</el-button>
        </template>
      </el-table-column>
      <el-table-column label="单据类型" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['', '有效', '停用'][scope.row.status] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="订单号" align="center" />
      <el-table-column prop="remarks" label="出库单号" align="center" />
      <el-table-column prop="remarks" label="验收单号" align="center" />
      <el-table-column prop="remarks" label="客户" align="center" />
      <el-table-column prop="remarks" label="出库日期" align="center" />
      <el-table-column prop="remarks" label="仓库信息" align="center" />
      <el-table-column prop="remarks" label="验收日期" align="center" />
      <el-table-column prop="remarks" label="验收金额(含税)" align="center" />
      <el-table-column prop="remarks" label="验收金额(未税)" align="center" />
      <el-table-column prop="remarks" label="备注" align="center" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['', '有效', '停用'][scope.row.status] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="验收人" align="center" />
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
  </el-card>
</template>

<script>
export default {
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
    uddateState(item) {
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
