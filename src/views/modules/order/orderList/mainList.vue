<template>
  <el-card shadow="never" class="headquarters">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">订单中心</el-tag>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="params.orderType" placeholder="请选择" class="w150px">
            <el-option label="全部" value="" />
            <el-option v-for="item in orderTypes.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询条件">
          <el-input v-model.trim="params.searchPar" placeholder="单号/客户/供应商/产品" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="dateRange"
            style="width: 250px;"
            type="monthrange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM"
            :editable="false"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w120px">
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
      <el-table-column :width="130" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" align="middle">
            <a class="font-blue el-icon-edit font-16" @click.stop="edit(scope.row)"></a>
            <a class="font-red el-icon-delete font-16" @click.stop="del(scope.row)"></a>
            <a class="font-blue" @click.stop="check(scope.row)">{{ scope.row.state ? '反审' : '审核' }}</a>
            <!-- <a class="font-blue">打印</a> -->
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :width="110" label="订单类型" align="center">
        <template slot-scope="scope">
          <span>
            {{ orderTypes[scope.row.orderType] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :min-width="100" label="客户/供应商" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.provderName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="160" prop="orderNo" label="订单号" align="center" />
      <el-table-column :width="135" prop="orderDate" label="订单日期" align="center" />
      <el-table-column :width="120" prop="taxSum" label="订购金额(含税)" align="center" />
      <el-table-column :width="120" prop="noTaxSum" label="订购金额(未税)" align="center" />
      <el-table-column :width="80" prop="orderCount" label="订购数量" align="center" />
      <el-table-column :min-width="250" prop="address" label="地址" align="center" />
      <el-table-column :min-width="180" prop="text" label="备注" align="center" />
      <el-table-column :width="60" label="状态" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['待审核', '已审核'][scope.row.state] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="80" prop="checkUserName" label="审核人" align="center" />
      <el-table-column :width="135" prop="checkDate" label="审核时间" align="center" />
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
    <order-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </el-card>
</template>

<script>
import { getOrderList, checkOrder, delOrder } from '@/api/order';
import orderForm from './components/order-form';

export default {
  components: {
    orderForm
  },
  data() {
    return {
      loading: false,
      orderTypeList: [
        { label: '销售订单', value: 'sales' },
        { label: '销售退货单', value: 'salesReturn' },
        { label: '采购订单', value: 'stock' },
        { label: '采购退货单', value: 'stockReturn' },
        { label: '专柜调货申请单', value: 'shoppeApply' },
        { label: '专柜销售单', value: 'shoppeSales' },
        { label: '专柜销售退货单', value: 'shoppeSalesReturn' },
        { label: '样品申请单', value: 'sampleApply' },
        { label: '样品退回单', value: 'sampleReturn' }
      ],
      params: {
        orderType: '',
        searchPar: '',
        clientType: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      dateRange: [],

      total: 0,
      tableData: [],
      dialog: {
        show: false,
        item: {}
      }
    };
  },
  computed: {
    orderTypes() {
      return this.$store.getters.getConstByKey('orderType');
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
      getOrderList(params).then(({ result }) => {
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
      this.dateRange = [];
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
      checkOrder({ id: item.id }).then(() => {
        this.$message.success('操作成功');
        this.getList();
      }).catch(() => {});
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delOrder({ ids: item.id })).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.headquarters {
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
