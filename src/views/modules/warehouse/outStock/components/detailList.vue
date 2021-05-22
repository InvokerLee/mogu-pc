<template>
  <div v-if="row.id">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-form ref="searchForm" hide-details size="mini" inline :model="params">
          <el-form-item label="">
            <el-tag type="info">产品明细</el-tag>
          </el-form-item>
          <el-form-item label="查询条件">
            <el-input v-model.trim="params.searchPar" placeholder="名称/规格/条码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        border
        size="mini"
        :max-height="600"
        :data="tableData"
      >
        <el-table-column type="index" label="序号" :width="55" align="center" />
        <el-table-column prop="productName" label="产品" align="center" />
        <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
        <el-table-column :min-width="100" prop="productSpec" label="规格" align="center" />
        <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
        <el-table-column :width="80" prop="count" label="数量" align="center" />
        <el-table-column :width="80" prop="boxCount" label="箱数" align="center" />
        <template v-if="showMore">
          <el-table-column :width="70" prop="taxRate" label="税率" align="center" />
          <el-table-column :width="80" prop="taxPrice" label="含税单价" align="center" />
          <el-table-column :width="80" prop="noTaxPrice" label="未税单价" align="center" />
          <el-table-column :width="100" prop="" label="含税箱单价" align="center" />
          <el-table-column :width="100" prop="" label="未税箱单价" align="center" />
          <el-table-column :width="110" prop="taxSum" label="含税出库金额" align="center" />
          <el-table-column :width="110" prop="noTaxSum" label="未税出库金额" align="center" />
          <el-table-column :width="90" prop="storeOutName" label="仓库" align="center" />
        </template>
        <template v-else>
          <el-table-column :width="90" prop="storeOutName" label="出库仓库" align="center" />
          <el-table-column :width="90" prop="storeInName" label="入库仓库" align="center" />
        </template>
        <el-table-column :min-width="120" prop="text" label="备注" align="center" />
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
    </el-card>
  </div>
</template>

<script>
import { outStoreDetailList } from '@/api/warehouse';

export default {
  props: ['row'],
  data() {
    return {
      loading: false,
      params: {
        searchPar: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  computed: {
    showMore() {
      return !['damageOutStore', 'otherOutStore', 'outStoreAllocationOutStore'].includes(this.row.orderType);
    }
  },
  watch: {
    row(val) {
      if (!val) {
        Object.assign(this.params, this.$options.data.call(this).params);
        return;
      }
      this.getList();
    }
  },
  methods: {
    getList() {
      const params = {
        orderId: this.row.id
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      outStoreDetailList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).finally(() => {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-list {
  width: 100%;
  margin-top: 3px;
  .pagination {
    text-align: center;
  }
  ::v-deep {
    .el-card__header {
      padding: 3px;
    }
    .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
