
<template>
  <base-wrapper>
    <div class="stockChangeHistory">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="单据类型">
          <el-select v-model="params.orderType" placeholder="请选择" class="w120px">
            <el-option label="全部" value="" />
            <el-option v-for="i in inOutStockTypes.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来往单位">
          <el-input v-model.trim="params.transitUnit" placeholder="客户/供应商名称" />
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model.trim="params.productName" placeholder="产品名称/规格/条码" />
        </el-form-item>
        <el-form-item label="类别">
          <category-search :params="params" paramsKey="productTypeId"></category-search>
        </el-form-item>
        <el-form-item label="品牌">
          <brand-search :params="params" paramsKey="productBrandId">></brand-search>
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
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 40}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
        >
          <el-table-column :width="55" label="序号" type="index" align="center" />
          <el-table-column :width="150" prop="orderNo" label="出/入库单号" align="center" />
          <el-table-column :width="135" prop="orderDate" label="日期" align="center" />
          <el-table-column :width="100" label="单据类型" align="center">
            <template slot-scope="scope">
              <span>
                {{ inOutStockTypes[scope.row.orderType] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :min-width="120" prop="providerOrGuest" label="来往单位" align="center" />
          <el-table-column prop="productTypeName" label="产品类别" align="center" />
          <el-table-column prop="productBrandName" label="品牌" align="center" />
          <el-table-column prop="productName" label="产品" align="center" />
          <el-table-column prop="barCode" label="条码" align="center" />
          <el-table-column prop="batchNum" label="批号" align="center" />
          <el-table-column prop="productDate" label="生产日期" align="center" />
          <el-table-column prop="price" label="单价" align="center" />
          <el-table-column prop="inStoreCount" label="入库数量" align="center" />
          <el-table-column prop="inStoreTaxSum" label="入库金额" align="center" />
          <el-table-column prop="outStoreCount" label="出库数量" align="center" />
          <el-table-column prop="outStoreTaxSum" label="出库金额" align="center" />
          <el-table-column prop="boxCount" label="箱数" align="center" />
          <el-table-column prop="storeName" label="仓库" align="center" />
          <el-table-column prop="orderText" label="单据备注" align="center" />
          <el-table-column :width="150" prop="parentOrderNo" label="上级单号" align="center" />
          <el-table-column :width="70" prop="checkMan" label="审核人" align="center" />
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
import CategorySearch from '@/components/CategorySearch';
import BrandSearch from '@/components/BrandSearch';
import { reportInstockAndOutStock } from '@/api/statistics';

export default {
  name: 'batchList',
  components: {
    CategorySearch,
    BrandSearch
  },
  data() {
    return {
      loading: false,
      params: {
        orderType: '',
        transitUnit: '',
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
  computed: {
    inOutStockTypes() {
      return this.$store.getters.getConstByKey('inOutStockType');
    }
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
      reportInstockAndOutStock(params).then(({ result }) => {
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
.stockChangeHistory {
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
