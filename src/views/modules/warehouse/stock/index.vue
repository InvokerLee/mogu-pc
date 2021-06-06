<template>
  <base-wrapper>
    <div class="stock">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" hide-details size="mini" inline :model="params">
            <el-form-item label="库存种类">
              <el-select v-model="params.searchType" placeholder="请选择" class="w120px">
                <el-option label="产品库存" value="stock" />
                <el-option label="批号库存" value="batch" />
              </el-select>
            </el-form-item>
            <el-form-item label="仓库类型">
              <el-select v-model="params.storeType" placeholder="请选择" class="w120px">
                <el-option label="全部" value="" />
                <el-option label="一般仓库" :value="0" />
                <el-option label="专柜仓库" :value="1" />
                <el-option label="样品仓库" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="类别">
              <category-search :params="params" paramsKey="productTypeId"></category-search>
            </el-form-item>
            <el-form-item label="品牌">
              <brand-search :params="params" paramsKey="productBrandId"></brand-search>
            </el-form-item>
            <el-form-item label="查询条件">
              <el-input v-model.trim="params.searchPar" placeholder="品名/规格/条码" />
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
          <el-table-column :width="80" prop="storeType" label="仓库类型" align="center">
            <template slot-scope="scope">
              <div>
                {{ ['一般仓库', '专柜仓库', '样品仓库'][scope.row.storeType] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :width="80" prop="productTypeName" label="类别" align="center" />
          <el-table-column :width="100" prop="productBrandName" label="品牌" align="center" />
          <el-table-column prop="productName" label="品名" align="center" />
          <el-table-column :min-width="100" prop="productSpec" label="规格型号" align="center" />
          <el-table-column :width="80" prop="storeName" label="仓库" align="center" />
          <el-table-column :width="90" prop="barCode" label="条码" align="center" />
          <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
          <el-table-column :width="80" prop="purchaseCount" label="当前数量" align="center" />
          <el-table-column :width="80" prop="purchaseBoxCount" label="当前箱数" align="center" />
          <el-table-column :width="110" prop="" label="当前库存成本额" align="center" />
          <el-table-column :width="100" prop="planOutCount" label="计划出库数量" align="center" />
          <el-table-column :width="100" prop="planOutBoxCount" label="计划出库箱数" align="center" />
          <el-table-column :min-width="100" prop="realOutCount" label="实际可用数量" align="center" />
          <el-table-column :width="80" prop="stockPrice" label="成本单价" align="center" />
          <el-table-column :width="110" prop="lastStockPrice" label="最近一次采购价" align="center" />
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
import { storestockList } from '@/api/warehouse';

export default {
  name: 'stock',
  components: {
    CategorySearch,
    BrandSearch
  },
  data() {
    return {
      loading: false,
      params: {
        searchType: 'stock',
        storeType: '',
        productTypeId: '',
        productBrandId: '',
        searchPar: '',
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
      storestockList(params).then(({ result }) => {
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
      this.$download('/storestock/export', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.stock {
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
