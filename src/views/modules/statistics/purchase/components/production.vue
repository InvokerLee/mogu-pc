<template>
  <base-wrapper>
    <div class="production">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" hide-details size="mini" inline :model="params">
            <el-form-item label="产品">
              <el-input v-model.trim="params.productName" placeholder="产品名称/规格/条码" />
            </el-form-item>
            <el-form-item label="类别">
              <category-search paramsKey="productTypeId" :params="params"></category-search>
            </el-form-item>
            <el-form-item label="品牌">
              <brand-search paramsKey="productBrandId" :params="params"></brand-search>
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
              <span style="margin: 0 20px;">
                <el-divider direction="vertical"></el-divider>
              </span>
              <el-button type="primary" size="mini" @click="download">导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 40}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
        >
          <el-table-column :width="55" label="序号" type="index" align="center"></el-table-column>
          <el-table-column prop="productName" label="产品" align="center" />
          <el-table-column :width="90" prop="orderCount" label="订购数量" align="center" />
          <el-table-column :width="80" prop="orderBoxCount" label="订购箱数" align="center" />
          <el-table-column :width="90" prop="orderTaxSum" label="订购金额" align="center" />
          <el-table-column :width="80" prop="orderInCount" label="入库数量" align="center" />
          <el-table-column :width="80" prop="orderInBoxCount" label="入库箱数" align="center" />
          <el-table-column :width="80" prop="orderInTaxSum" label="入库金额" align="center" />
          <el-table-column :width="80" prop="returnCount" label="退货数量" align="center" />
          <el-table-column :width="90" prop="returnTaxSum" label="退货金额" align="center" />
          <el-table-column :min-width="100" prop="returnOutCount" label="退货出库数量" align="center" />
          <el-table-column :min-width="100" prop="returnOutTaxSum" label="退货出库金额" align="center" />
          <el-table-column :width="80" prop="stockCount" label="采购数量" align="center" />
          <el-table-column :width="80" prop="stockBoxCount" label="采购箱数" align="center" />
          <el-table-column :width="80" prop="stockTaxSum" label="采购金额" align="center" />
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
import CategorySearch from '@/components/CategorySearch';
import BrandSearch from '@/components/BrandSearch';
import { reportStockProduct } from '@/api/statistics';

export default {
  components: {
    CategorySearch,
    BrandSearch
  },
  data() {
    return {
      loading: false,
      params: {
        productName: '',
        productTypeId: '',
        productBrandId: '',
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
      reportStockProduct(params).then(({ result }) => {
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
      this.$download('/report/productExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.production {
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
