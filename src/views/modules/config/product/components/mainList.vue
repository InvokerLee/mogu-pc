<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">产品信息</el-tag>
        </el-form-item>
        <el-form-item label="输入搜索">
          <el-input v-model.trim="params.serachPar" placeholder="品名/规格/条码" />
        </el-form-item>
        <el-form-item label="类别">
          <category-search :params="params" paramsKey="productTypeId"></category-search>
        </el-form-item>
        <el-form-item label="品牌">
          <brand-search :params="params" paramsKey="productBrandId"></brand-search>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.status" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
          <el-button type="primary" size="mini" @click="download">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      size="mini"
      :max-height="600"
      :data="tableData"
      highlight-current-row
      @current-change="rowChange"
    >
      <el-table-column :width="60" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" class="font-16">
            <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
            <!-- <a class="font-red el-icon-delete" @click="del(scope.row)"></a> -->
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="品名" align="center" />
      <el-table-column :width="100" prop="spec" label="规格" align="center" />
      <el-table-column :width="100" prop="barCode" label="条码" align="center" />
      <el-table-column prop="productTypeName" label="类别" align="center" />
      <el-table-column prop="productBrandName" label="品牌" align="center" />
      <el-table-column :width="60" prop="unit" label="单位" align="center" />
      <el-table-column :width="60" prop="boxUnit" label="箱单位" align="center" />
      <el-table-column :width="60" prop="boxCount" label="箱装量" align="center" />
      <el-table-column prop="stockPrice" label="采购价" align="center" />
      <el-table-column prop="salsePrice" label="发货价" align="center" />
      <el-table-column :width="60" prop="grossProfitRate" label="毛利率" align="center" />
      <el-table-column :width="80" prop="stockTaxRate" label="进货税率" align="center" />
      <el-table-column :width="80" prop="salesTaxRate" label="发货税率" align="center" />
      <el-table-column :width="90" prop="salseNoTaxPrice" label="发货价(未税)" align="center" />
      <el-table-column :width="60" prop="shelfDays" label="保质期" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['停用', '有效'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
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
    <form-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import { productList } from '@/api/config';

import CategorySearch from '@/components/CategorySearch';
import BrandSearch from '@/components/BrandSearch';
import formDialog from './form-dialog';
export default {
  components: {
    formDialog,
    CategorySearch,
    BrandSearch
  },
  data() {
    return {
      loading: false,
      params: {
        serachPar: '',
        productTypeId: '',
        productBrandId: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialog: {
        show: false,
        item: {}
      }
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
      productList(params).then(({ result }) => {
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
    add() {
      this.dialog.item = {};
      this.dialog.show = true;
    },
    edit(item) {
      this.dialog.item = item;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
    },
    rowChange(row) {
      this.$emit('rowClickChange', row);
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    download() {
      this.$download('/productinfo/export', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-list {
  width: 100%;
  .pagination {
    text-align: center;
  }
  ::v-deep {
    .el-card__header, .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
