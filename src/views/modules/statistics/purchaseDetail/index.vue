
<template>
  <base-wrapper>
    <div class="purchase-detail">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="产品">
          <el-input v-model.trim="params.productName" placeholder="产品名称/规格/条码" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model.trim="params.providerName" placeholder="请输入公司名" />
        </el-form-item>
        <el-form-item label="类别">
          <category-search :params="params" paramsKey="productTypeId"></category-search>
        </el-form-item>
        <el-form-item label="品牌">
          <brand-search :params="params" paramsKey="productBrandId"></brand-search>
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
          <el-table-column :min-width="100" prop="provderName" label="供应商名称" align="center" />
          <el-table-column prop="productTypeName" label="类别" align="center" />
          <el-table-column prop="productBrandName" label="品牌" align="center" />
          <el-table-column prop="productName" label="产品" align="center" />
          <el-table-column prop="productBarCode" label="条码" align="center" />
          <el-table-column :width="80" prop="orderCount" label="订购数量" align="center" />
          <el-table-column :width="90" prop="orderTaxSum" label="订购金额" align="center" />
          <el-table-column :width="80" prop="orderInCount" label="入库数量" align="center" />
          <el-table-column :width="90" prop="orderInTaxSum" label="入库金额" align="center" />
          <el-table-column :width="80" prop="returnCount" label="退货数量" align="center" />
          <el-table-column :width="90" prop="returnTaxSum" label="退货金额" align="center" />
          <el-table-column :min-width="100" prop="returnOutCount" label="退货出库数量" align="center" />
          <el-table-column :min-width="100" prop="returnOutTaxSum" label="退货出库金额" align="center" />
          <el-table-column :width="80" prop="" label="单价" align="center" />
          <el-table-column :width="80" prop="stockCount" label="采购数量" align="center" />
          <el-table-column :width="90" prop="stockTaxSum" label="采购金额" align="center" />
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
import CategorySearch from '@/components/CategorySearch';
import BrandSearch from '@/components/BrandSearch';
import { reportStockDetail } from '@/api/statistics';

export default {
  name: 'purchaseDetail',
  components: {
    CategorySearch,
    BrandSearch
  },
  data() {
    return {
      loading: false,
      params: {
        productName: '',
        providerName: '',
        productTypeId: '',
        productBrandId: '',
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
      Object.assign(params, this.formatDate(this.dateRange));
      this.loading = true;
      reportStockDetail(params).then(({ result }) => {
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
      this.$download('/report/stockDetailExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.purchase-detail {
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
