
<template>
  <base-wrapper>
    <div class="saleman">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="业务员">
          <el-input v-model.trim="params.bizManName" placeholder="" />
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
          <el-table-column :width="70" prop="bizName" label="业务员" align="center" />
          <el-table-column prop="salesOrderTaxSum" label="订购金额" align="center" />
          <el-table-column prop="salesOutTaxSum" label="出库金额" align="center" />
          <el-table-column prop="specialCheckTaxSum" label="回单金额" align="center" />
          <el-table-column prop="specialDamageTaxSum" :min-width="100" label="验收损耗金额" align="center" />
          <el-table-column prop="specialDamageCostSum" :min-width="100" label="验收损耗成本" align="center" />
          <el-table-column prop="specialReturnTaxSum" :min-width="100" label="验收退货金额" align="center" />
          <el-table-column prop="specialReturnInStoreTaxSum" :min-width="120" label="验收退货入库金额" align="center" />
          <el-table-column prop="specialReturnInStoreDamageTaxSum" :min-width="150" label="验收退货入库报损金额" align="center" />
          <el-table-column prop="specialReturnInStoreDamageCostSum" :min-width="150" label="验收退货入库报损成本" align="center" />
          <el-table-column prop="salesReturnTaxSum" label="退货金额" align="center" />
          <el-table-column prop="salesReturnInTaxSum" :min-width="100" label="退货入库金额" align="center" />
          <el-table-column prop="returnDamageTaxSum" :min-width="100" label="退货报损金额" align="center" />
          <el-table-column prop="returnDamageCostSum" :min-width="100" label="退货报损成本" align="center" />
          <el-table-column prop="salesCount" label="销售数量" align="center" />
          <el-table-column prop="salesBoxCount" label="销售箱数" align="center" />
          <el-table-column prop="salesTaxSum" label="销售金额" align="center" />
          <el-table-column prop="prouctCostSum" :min-width="100" label="产品成本金额" align="center" />
          <el-table-column prop="grossMargin" label="毛利额" align="center" />
          <el-table-column prop="grossRate" label="毛利率" align="center" />
          <el-table-column prop="damageRate" label="损耗率" align="center" />
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination pt-3"
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
import { reportSalesBizMan } from '@/api/statistics';

export default {
  name: 'saleman',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        bizManName: '',
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
      reportSalesBizMan(params).then(({ result }) => {
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
      this.$download('/report/bizManExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.saleman {
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
