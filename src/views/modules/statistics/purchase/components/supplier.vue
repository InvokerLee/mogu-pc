<template>
  <base-wrapper>
    <div class="supplier">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" hide-details size="mini" inline :model="params">
            <el-form-item label="供应商">
              <el-input v-model.trim="params.providerName" placeholder="" />
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
          <el-table-column :min-width="120" prop="provderName" label="供应商" align="center" />
          <el-table-column :width="90" prop="orderTaxSum" label="订单金额" align="center" />
          <el-table-column :width="90" prop="orderInTaxSum" label="入库金额" align="center" />
          <el-table-column :width="90" prop="returnTaxSum" label="退货金额" align="center" />
          <el-table-column :width="100" prop="returnOutTaxSum" label="退货出库金额" align="center" />
          <el-table-column :width="90" prop="stockTaxSum" label="采购金额" align="center" />
          <el-table-column :width="110" prop="" label="采购调整单金额" align="center" />
          <el-table-column :width="100" prop="" label="采购开票金额" align="center" />
          <el-table-column :width="100" prop="" label="采购付款金额" align="center" />
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
import { reportStockProvider } from '@/api/statistics';

export default {
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        providerName: '',
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
      reportStockProvider(params).then(({ result }) => {
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
      this.$download('/report/providerExport', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.supplier {
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
