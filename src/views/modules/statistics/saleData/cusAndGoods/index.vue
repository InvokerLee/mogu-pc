
<template>
  <base-wrapper>
    <div class="cusAndGoods">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="类型">
          <el-select v-model="isHead" class="w90px">
            <el-option :value="true" label="总部"></el-option>
            <el-option :value="false" label="门店"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model.trim="params.guestName" placeholder="输入客户名称" />
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
          <el-button type="primary" size="mini">导出</el-button>
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
          <el-table-column :min-width="100" prop="guestName" label="客户" align="center" />
          <el-table-column prop="productTypeName" label="产品类别" align="center" />
          <el-table-column prop="productBrandName" label="品牌" align="center" />
          <el-table-column :min-width="100" prop="productName" label="产品" align="center" />
          <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
          <el-table-column prop="salesOrderCount" label="订购数量" align="center" />
          <el-table-column prop="salesOrderBoxCount" label="订购箱数" align="center" />
          <el-table-column prop="salesOrderTaxSum" label="订购金额" align="center" />
          <el-table-column prop="salesOutCount" label="出库数量" align="center" />
          <el-table-column prop="salesOutBoxCount" label="出库箱数" align="center" />
          <el-table-column prop="salesOutTaxSum" label="出库金额" align="center" />
          <el-table-column prop="salesOutCostSum" label="出库成本" align="center" />
          <el-table-column prop="specialCheckCount" label="回单数量" align="center" />
          <el-table-column prop="specialCheckBoxCount" label="回单箱数" align="center" />
          <el-table-column prop="specialCheckTaxSum" label="回单金额" align="center" />
          <el-table-column prop="specialCheckCostSum" label="回单成本" align="center" />
          <el-table-column :min-width="100" prop="specialReturnCount" label="验收退货数量" align="center" />
          <el-table-column :min-width="100" prop="specialReturnBoxCount" label="验收退货箱数" align="center" />
          <el-table-column :min-width="100" prop="specialReturnTaxSum" label="验收退货金额" align="center" />
          <el-table-column :min-width="100" prop="specialReturnCostSum" label="验收退货成本" align="center" />
          <el-table-column :min-width="100" prop="specialDamageCount" label="验收损耗数量" align="center" />
          <el-table-column :min-width="100" prop="specialDamageBoxCount" label="验收损耗箱数" align="center" />
          <el-table-column :min-width="100" prop="specialDamageTaxSum" label="验收损耗金额" align="center" />
          <el-table-column :min-width="100" prop="specialDamageCostSum" label="验收损耗成本" align="center" />
          <el-table-column :min-width="120" prop="specialReturnInStoreCount" label="验收退货入库数量" align="center" />
          <el-table-column :min-width="120" prop="specialReturnInStoreBoxCount" label="验收退货入库箱数" align="center" />
          <el-table-column :min-width="120" prop="specialReturnInStoreTaxSum" label="验收退货入库金额" align="center" />
          <el-table-column :min-width="120" prop="specialReturnInStoreCostSum" label="验收退货入库成本" align="center" />
          <el-table-column :min-width="150" prop="specialReturnInStoreDamageCount" label="验收退货入库报损数量" align="center" />
          <el-table-column :min-width="150" prop="specialReturnInStoreDamageBoxCount" label="验收退货入库报损箱数" align="center" />
          <el-table-column :min-width="150" prop="specialReturnInStoreDamageTaxSum" label="验收退货入库报损金额" align="center" />
          <el-table-column :min-width="150" prop="specialReturnInStoreDamageCostSum" label="验收退货入库报损成本" align="center" />
          <el-table-column prop="salesReturnCount" label="退货数量" align="center" />
          <el-table-column prop="salesReturnBoxCount" label="退货箱数" align="center" />
          <el-table-column prop="salesReturnTaxSum" label="退货金额" align="center" />
          <el-table-column prop="salesReturnCostSum" label="退货成本" align="center" />
          <el-table-column :min-width="100" prop="salesReturnInCount" label="退货入库数量" align="center" />
          <el-table-column :min-width="100" prop="salesReturnInBoxCount" label="退货入库箱数" align="center" />
          <el-table-column :min-width="100" prop="salesReturnInTaxSum" label="退货入库金额" align="center" />
          <el-table-column :min-width="100" prop="salesReturnInCostSum" label="退货入库成本" align="center" />
          <el-table-column :min-width="100" prop="returnDamageCount" label="退货报损数量" align="center" />
          <el-table-column :min-width="100" prop="returnDamageBoxCount" label="退货报损箱数" align="center" />
          <el-table-column :min-width="100" prop="returnDamageTaxSum" label="退货报损金额" align="center" />
          <el-table-column :min-width="100" prop="returnDamageCostSum" label="退货报损成本" align="center" />
          <el-table-column prop="salesCount" label="销售数量" align="center" />
          <el-table-column prop="salesBoxCount" label="销售箱数" align="center" />
          <el-table-column prop="salesTaxSum" label="销售金额" align="center" />
          <el-table-column :min-width="100" prop="prouctCostSum" label="产品成本金额" align="center" />
          <el-table-column prop="grossMargin" label="毛利额" align="center" />
          <el-table-column prop="grossRate" label="毛利率" align="center" />
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
import { reportSalesGuestAndProductOfHeader, reportSalesGuestAndProductOfShop } from '@/api/statistics';

export default {
  name: 'cusAndGoods',
  components: {
    CategorySearch,
    BrandSearch
  },
  data() {
    return {
      loading: false,
      isHead: true,
      params: {
        guestName: '',
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
      const func = this.isHead ? reportSalesGuestAndProductOfHeader : reportSalesGuestAndProductOfShop;
      func(params).then(({ result }) => {
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
      const downloadApi = this.isHead ? '/report/guestAndProductOfHeaderExport' : '/report/guestAndProductOfShopExport';
      this.$download(downloadApi, { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.cusAndGoods {
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
