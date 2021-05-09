
<template>
  <base-wrapper>
    <div class="goodsGrossProfit">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="产品">
          <el-input v-model.trim="params.productName" placeholder="名称/规格/条码" />
        </el-form-item>
        <el-form-item label="毛利额低于">
          <el-input v-model.trim="params.grossRate" placeholder="" class="w120px" />
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker
            v-model="params.yearMonth"
            style="width: 120px;"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
          >
          </el-date-picker>
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
          <el-table-column :width="80" prop="yearMonth" label="月份" align="center" />
          <el-table-column prop="productName" label="产品" align="center" />
          <el-table-column :width="80" prop="productBarCode" label="条码" align="center" />
          <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
          <el-table-column prop="salesSum" label="销售金额" align="center" />
          <el-table-column prop="costSum" label="成本金额" align="center" />
          <el-table-column prop="grossMargin" label="毛利额" align="center" />
          <el-table-column prop="grossRate" label="毛利率" align="center" />
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
import { reportProductGrossProfit } from '@/api/statistics';

export default {
  name: 'goodsGrossProfit',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        productName: '',
        grossRate: '',
        yearMonth: '',
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
      reportProductGrossProfit(params).then(({ result }) => {
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
      this.$download('/report/productGrossProfitExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.goodsGrossProfit {
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
