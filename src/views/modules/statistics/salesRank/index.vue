
<template>
  <base-wrapper>
    <div class="salesRank">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="销售计算方式">
          <el-select v-model="params.salesReportType" placeholder="请选择" class="w120px">
            <el-option label="验收-退货" :value="0" />
            <el-option label="验收" :value="1" />
            <el-option label="发货" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select v-model="params.sortType" placeholder="请选择" class="w90px">
            <el-option label="滞销" :value="1" />
            <el-option label="畅销" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计标准">
          <el-select v-model="params.statisticsType" placeholder="请选择" class="w90px">
            <el-option label="数量" :value="1" />
            <el-option label="金额" :value="0" />
          </el-select>
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
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 40}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
        >
          <el-table-column width="55" type="index" label="序号" align="center" />
          <el-table-column prop="productName" label="产品" align="center" />
          <el-table-column prop="productBarCode" label="条码" align="center" />
          <el-table-column prop="productUnit" label="单位" align="center" />
          <el-table-column prop="salesCount" label="销售数量" align="center" />
          <el-table-column prop="salesSum" label="销售金额" align="center" />
          <el-table-column prop="storeCount" :min-width="100" label="当前库存数量" align="center" />
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
      </div>
    </div>
  </base-wrapper>
</template>

<script>
import { reportSalableAndUnsalable } from '@/api/statistics';

export default {
  name: 'salesRank',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        salesReportType: 0,
        sortType: 1,
        statisticsType: 1,
        curentPage: 1,
        pageSize: 10
      },
      dateRange: [],
      total: 0,
      tableData: []
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
      reportSalableAndUnsalable(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).catch(() => {}).finally(() => {
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
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    download() {
      this.$download('/report/storeInAndStoreOutExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.salesRank {
  width: 100%;
  .tar {
    width: auto;
    flex: 0 0 auto;
  }
  .pagination {
    text-align: center;
  }
}
</style>
