
<template>
  <base-wrapper>
    <div class="customerGrossProfit">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="客户">
          <el-input v-model.trim="params.guestName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="毛利率低于">
          <el-input v-model.trim="params.grossRate" placeholder="" class="w90px" />
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
          <el-table-column prop="guestName" label="客户" align="center" />
          <el-table-column :width="100" prop="costSum" label="成本金额" align="center" />
          <el-table-column :width="100" prop="salesSum" label="销售金额" align="center" />
          <el-table-column :width="100" prop="grossMargin" label="毛利额" align="center" />
          <el-table-column :width="100" prop="grossRate" label="毛利率" align="center" />
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
      </div>
    </div>
  </base-wrapper>
</template>

<script>
import { reportGuestGrossProfit } from '@/api/statistics';

export default {
  name: 'customerGrossProfit',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        guestName: '',
        yearMonth: '',
        grossRate: '',
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
      reportGuestGrossProfit(params).then(({ result }) => {
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
      this.$download('/report/guestGrossProfitExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.customerGrossProfit {
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
