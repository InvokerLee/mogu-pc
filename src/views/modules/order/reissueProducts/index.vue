<template>
  <div class="reissue-products">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="商品编号" prop="product_numer">
        <el-input class="input-width" v-model="params.product_numer"></el-input>
      </el-form-item>
      <el-form-item label="归属订单" prop="order_no">
        <el-input class="input-width" v-model="params.order_no"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input class="input-width" v-model="params.customer_code"></el-input>
      </el-form-item>
      <el-form-item label="补发订单" prop="supply_order_no">
        <el-input class="input-width" v-model="params.supply_order_no"></el-input>
      </el-form-item>
      <el-form-item label="补发状态" prop="status">
        <el-select class="input-width" v-model="params.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in Object.entries(reissueStatus)" :key="item[0]" :label="item[1]" :value="item[0]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补发类型" prop="type">
        <el-select class="input-width" v-model="params.type">
          <el-option label="全部" value=""></el-option>
          <el-option label="拆单补发" :value="1"></el-option>
          <el-option label="退货补发" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补发方式" prop="type">
        <el-select class="input-width" v-model="params.way">
          <el-option label="全部" value=""></el-option>
          <el-option label="国内下单补发" :value="1"></el-option>
          <el-option label="外贸重发" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="补发时间" prop="supply_time">
        <el-date-picker
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
          v-model="params.supply_time"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$hasPermission('searchReissueProduct')" @click="search">{{ $hasPermission('searchReissueProduct') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" size="mini" v-if="$hasPermission('generateOrder')" @click="addOrder">{{ $hasPermission('generateOrder') }}</el-button>
      <el-button type="danger" size="mini" v-if="$hasPermission('fobidReissueProduct')" @click="forbidProduct">{{ $hasPermission('fobidReissueProduct') }}</el-button>
    </div>
    <div class="m-t-10">
      <el-table
        border
        size="mini"
        height="120px"
        v-adaptive-height="{bottomOffset: 100}"
        v-loading="loading"
        :data="tableData"
        @selection-change="(val) => { selectItems = val }"
      >
        <el-table-column width="55" type="selection" align="center"></el-table-column>
        <el-table-column prop="customer_code" label="客户编号" align="center"></el-table-column>
        <el-table-column label="归属订单" align="center" width="110px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="$hasPermission('orderDetail')" @click="toOrderDetail(scope.row.order_id)">{{ scope.row.order_no }}</el-button>
            <div v-else>{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="product_number" label="商品编号" align="center"></el-table-column>
        <el-table-column label="厂商型号/品牌" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.mpn }}</div>
            <div>{{ scope.row.brand }}</div>
            <div>{{ scope.row.customer_tag }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="unit_price" label="单价" align="center"></el-table-column>
        <el-table-column prop="quantity" label="数量" align="center"></el-table-column>
        <el-table-column label="金额(已扣除优惠)" align="center">
          <template slot-scope="scope">
            <span>${{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补发类型" align="center">
          <template slot-scope="scope">
            <span>{{ ['', '拆单补发 ', '退货补发'][scope.row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" align="center"></el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <span>{{ status[scope.row.order_status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补发方式" align="center">
          <template slot-scope="scope">
            <span>{{ ['', '国内下单补发 ', '外贸重发'][scope.row.way] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="apply_user_name" label="创建人" align="center"></el-table-column>
        <el-table-column label="补发状态" align="center">
          <template slot-scope="scope">
            <span>{{ reissueStatus[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补发订单" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="$hasPermission('orderDetail')" @click="toOrderDetail(scope.row.supply_order_id)">{{ scope.row.supply_order_no }}</el-button>
            <div v-else>{{ scope.row.supply_order_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supply_time" label="补发时间" align="center"></el-table-column>
        <el-table-column prop="supply_user_name" label="补发人" align="center"></el-table-column>
        <el-table-column prop="supply_quantity" label="补发数量" align="center"></el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        v-if="tableData.length"
        class="pagination"
        :current-page.sync="params.page"
        :page-size="params.limit"
        :total="total"
        :page-sizes="[10,20,50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <forbid-reissue-product
      v-if="dialog.show && dialog.name === 'FORBID_REISSUE_PRODUCT'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </forbid-reissue-product>
  </div>
</template>

<script>
import { getSupplyProducts } from '@/api/order';

import forbidReissueProduct from './components/forbid-reissue-product';

export default {
  name: 'reissueProducts',
  components: {
    forbidReissueProduct,
  },
  data() {
    return {
      loading: false,
      params: {
        product_numer: '',
        order_no: '',
        customer_code: '',
        supply_order_no: '',
        type: '',
        way: '',
        status: '',
        supply_time: '',
        page: 1,
        limit: 50,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      dialog: {
        show: false,
        name: '',
      },
    };
  },
  computed: {
    reissueStatus() {
      return {
        1: '待补发',
        2: '已补发',
        '-1': '已作废',
      };
    },
    status() {
      return this.$store.getters.getConstByGroup('status');
    },
  },
  created() {
    this.getList();
  },
  methods: {
    search() {
      this.params.page = 1;
      this.getList();
    },
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      getSupplyProducts(params).then(({ data }) => {
        this.tableData = data.data;
        this.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    reset(params) {
      this.$refs.searchForm.resetFields();
      this.search();
    },
    handleCurrentChange() {
      this.getList();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.getList();
    },
    addOrder() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择');
        return;
      }
      const { order_no, type } = this.selectItems[0];
      if (this.selectItems.some(i => i.status !== 1 || i.order_no !== order_no || i.type !== type)) {
        this.$message.warning('只允许同一订单且补发类型相同的待补发商品进行操作');
        return;
      }
      const ids = this.selectItems.map(v => v.id).join(',');
      this.$router.push(`/order/addReissueOrder?ids=${ids}`);
    },
    forbidProduct() {
      if (!this.isSelectSingle()) return;
      this.openDialog('FORBID_REISSUE_PRODUCT');
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
    },
    openDialog(name) {
      this.dialog.name = name;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    toOrderDetail(orderId) {
      this.$router.push(`/order/orderDetail?orderId=${orderId}`);
    },
    isSelectSingle() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.reissue-products {
  width: 100%;
  padding: 20px;
  .input-width {
    width: 150px;
  }
  .pagination {
    text-align: center;
    margin: 20px 0;
  }
}
</style>
