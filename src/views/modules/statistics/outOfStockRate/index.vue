
<template>
  <base-wrapper>
    <div class="outOfStockRate">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="客户">
          <el-input v-model.trim="params.guestName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="订单缺货率大于">
          <el-input v-model.trim="params.orderLackRate" placeholder="" class="w90px" />
        </el-form-item>
        <el-form-item label="出库缺货率大于">
          <el-input v-model.trim="params.outLackRate" placeholder="" class="w90px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="primary" size="mini" @click="download">导出</el-button>
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
          <el-table-column :width="135" prop="orderDate" label="订购日期" align="center" />
          <el-table-column :width="140" prop="orderNo" label="订单号" align="center" />
          <el-table-column :min-width="120" prop="guestName" label="客户" align="center" />
          <el-table-column :min-width="120" prop="productName" label="产品" align="center" />
          <el-table-column prop="orderCount" label="订购数量" align="center" />
          <el-table-column prop="orderBoxCount" label="订购箱数" align="center" />
          <el-table-column prop="orderTaxSum" label="订购金额" align="center" />
          <el-table-column prop="outStoreCount" label="出库数量" align="center" />
          <el-table-column prop="outStoreBoxCount" label="出库箱数" align="center" />
          <el-table-column prop="checkCount" label="验收数量" align="center" />
          <el-table-column prop="checkBoxCount" label="验收箱数" align="center" />
          <el-table-column :min-width="95" prop="orderLackRate" label="订单缺货率" align="center" />
          <el-table-column :min-width="95" prop="outLackRate" label="出库缺货率" align="center" />
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
import { reportOrderOutageRate } from '@/api/statistics';

export default {
  name: 'outOfStockRate',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        guestName: '',
        orderLackRate: '',
        outLackRate: '',
        curentPage: 1,
        pageSize: 10
      },
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
      this.loading = true;
      reportOrderOutageRate(params).then(({ result }) => {
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
      this.$download('/report/orderOutageRateExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.outOfStockRate {
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
