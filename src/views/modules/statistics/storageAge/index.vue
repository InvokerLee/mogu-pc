
<template>
  <base-wrapper>
    <div class="storageAge">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="产品">
          <el-input v-model.trim="params.productName" placeholder="产品名称/规格/条码" />
        </el-form-item>
        <el-form-item label="仓库">
          <warehous-selector :params="params" paramsKey="storeId"></warehous-selector>
        </el-form-item>
        <el-form-item label="类别">
          <category-search paramsKey="productTypeId" :params="params"></category-search>
        </el-form-item>
        <el-form-item label="保质期剩余">
          <el-select v-model="params.surplusType" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="二分之一" :value="0" />
            <el-option label="三分之一" :value="1" />
            <el-option label="三分之二" :value="2" />
            <el-option label="四分之一" :value="3" />
          </el-select>
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
          <el-table-column :width="80" prop="storeName" label="仓库" align="center" />
          <el-table-column :min-width="100" prop="providerName" label="供应商" align="center" />
          <el-table-column prop="productTypeName" label="类别" align="center" />
          <el-table-column :min-width="120" prop="productName" label="产品" align="center" />
          <el-table-column :width="80" prop="productBarCode" label="条码" align="center" />
          <el-table-column prop="salesCount" label="库存量" align="center" />
          <el-table-column prop="batchNum" label="批号" align="center" />
          <el-table-column prop="productDate" label="生产日期" align="center" />
          <el-table-column :width="70" prop="productValidityDate" label="有效期" align="center" />
          <el-table-column :width="70" prop="shortTime" label="保质期" align="center" />
          <el-table-column :width="70" prop="surplusDay" label="剩余天数" align="center" />
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
import WarehousSelector from '@/components/WarehousSelector';
import CategorySearch from '@/components/CategorySearch';

import { reportAgeException } from '@/api/statistics';

export default {
  name: 'storageAge',
  components: {
    WarehousSelector,
    CategorySearch
  },
  data() {
    return {
      loading: false,
      params: {
        productName: '',
        storeId: '',
        productTypeId: '',
        surplusType: '',
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
      reportAgeException(params).then(({ result }) => {
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
      this.$download('/report/storeAgeExceptionExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.storageAge {
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
