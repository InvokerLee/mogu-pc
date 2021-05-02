<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">促销列表</el-tag>
        </el-form-item>
        <el-form-item label="输入搜索">
          <el-input v-model.trim="params.productName" placeholder="品名/规格/条码" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model.trim="params.guestName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="变价属性">
          <el-select v-model="params.priceType" placeholder="请选择" class="w120px">
            <el-option label="全部" value="" />
            <el-option label="邮报变价" :value="0" />
            <el-option label="店庆变价" :value="1" />
            <el-option label="DM变价" :value="2" />
            <el-option label="市场调变" :value="3" />
            <el-option label="其他" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="已审核" :value="1" />
            <el-option label="待审核" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
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
      <el-table-column :width="100" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" align="middle">
            <a class="font-blue el-icon-edit font-16" @click="edit(scope.row)"></a>
            <!-- <a class="font-red el-icon-delete font-16" @click="del(scope.row)"></a> -->
            <a class="font-blue" @click="check(scope.row)">{{ scope.row.state ? '取消审核' : '审核' }}</a>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :width="180" show-overflow-tooltip prop="guestName" label="客户" align="center" />
      <el-table-column prop="productName" label="产品" align="center" />
      <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
      <el-table-column :width="70" label="变价属性" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['邮报变价', '店庆变价', 'DM变价', '市场调变', '其他'][scope.row.priceType] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="80" prop="auctionCalendar" label="档期" align="center" />
      <el-table-column :width="80" prop="limitCount" label="限量" align="center" />
      <el-table-column :width="135" prop="startDate" label="开始时间" align="center" />
      <el-table-column :width="135" prop="endDate" label="结束时间" align="center" />
      <el-table-column :min-width="90" prop="oldTaxPrice" label="原供价(含税)" align="center" />
      <el-table-column :min-width="90" prop="newTaxPrice" label="现供价(含税)" align="center" />
      <el-table-column :min-width="90" prop="oldNoTaxPrice" label="原供价(未税)" align="center" />
      <el-table-column :min-width="90" prop="newNoTaxPrice" label="现供价(未税)" align="center" />
      <el-table-column :width="70" prop="giftCount" label="赠品基数" align="center" />
      <el-table-column prop="text" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['待审核', '已审核'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
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
    <main-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import { promotionList, delPromotion, checkPromotion } from '@/api/config';

import mainForm from './main-form';
export default {
  components: {
    mainForm
  },
  data() {
    return {
      loading: false,
      params: {
        productName: '',
        guestName: '',
        priceType: '',
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
      promotionList(params).then(({ result }) => {
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
    check(item) {
      checkPromotion({ id: item.id }).then(() => {
        this.$message.success('操作成功');
        this.getList();
      }).catch(() => {});
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delPromotion(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
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
