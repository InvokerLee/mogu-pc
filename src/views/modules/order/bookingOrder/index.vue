<template>
  <div class="booking-order">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="订单号" prop="order_no">
        <el-input v-model="params.order_no" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="国内订单号" prop="szlcsc_no">
        <el-input v-model="params.szlcsc_no" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input v-model="params.customer_code" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="跟进人" prop="follow_by">
        <el-input v-model="params.follow_by" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="order_status">
        <el-select v-model="params.order_status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in status.itemList" :key="item.value" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订货状态" prop="inquiry_status">
        <el-select v-model="params.inquiry_status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in inquiryStatus.itemList" :key="item.value" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="created_at">
        <el-date-picker
          v-model="params.created_at"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付到期时间" prop="expired_date">
        <el-date-picker
          v-model="params.expired_date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('searchBackOrder')" type="primary" @click="search">{{ $hasPermission('searchBackOrder') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-alert
      title=""
      :closable="false"
      type="info"
    >
      <div slot="title">
        <div>点击查看询价信息，如有重要采购备注需通知客户请直接编辑翻译，确认所有报价信息无误后点审核通过，客户随后可在个人订单历史查看询价结果以及进行订单支付。</div>
        <div>报价有效期≤2天的已标红，请注意及时审核。报价已失效的商品会限制客户进行支付。</div>
        <div class="font-red">*如未能及时审核导致在通知客户前出现报价已失效的情况，请联系采购沟通有效期是否可延长。</div>
        <div class="font-red">*如需采购更新报价，请在审核通过前联系采购在ERP重新报价，系统将会同步最新询价结果</div>
      </div>
    </el-alert>
    <div class="m-t-10">
      <el-table
        v-adaptive-height="{bottomOffset: 100}"
        v-loading="loading"
        border
        size="mini"
        height="120px"
        :data="tableData"
      >
        <el-table-column label="客户编号" align="center" width="100px">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.customer_code }}</span>
              <span v-if="scope.row.is_top" class="font-red">(头部客户)</span>
            </div>
            <el-button v-if="$hasPermission('searchBackOrder')" type="text" size="mini" @click="reset({customer_code: scope.row.customer_code})">历史订单</el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" width="135px">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="toDetail(scope.row)">{{scope.row.order_no}}</el-button> -->
            <div>{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="inquiry_status" label="订货状态" align="center"></el-table-column>
        <el-table-column prop="order_status" label="订单状态" align="center"></el-table-column>
        <el-table-column label="商品总金额" align="center">
          <template slot-scope="scope">
            <div>${{ scope.row.total_amount || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column label="现货商品金额" align="center">
          <template slot-scope="scope">
            <div>${{ scope.row.in_stock_total || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订货商品金额" align="center">
          <template slot-scope="scope">
            <div>${{ scope.row.back_order_total || 0 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="back_order_count" label="订货商品数" align="center"></el-table-column>
        <el-table-column label="最短报价有效期" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.min_validate_date }}</div>
            <div v-if="scope.row.showMinValidateDateTip" class="font-red">(即将失效)</div>
          </template>
        </el-table-column>
        <el-table-column prop="expired_date" label="支付到期时间" align="center"></el-table-column>
        <el-table-column prop="follow_by" label="跟进人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('enquiryInfo')" size="mini" type="primary" @click="watchEnquiry(scope.row)">{{ $hasPermission('enquiryInfo') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        :current-page.sync="params.page"
        :page-size="params.limit"
        :total="total"
        :page-sizes="[10,20,30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { orderInquiryList } from '@/api/order';

export default {
  name: 'bookingOrder',
  data() {
    return {
      loading: false,
      params: {
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        order_status: '',
        inquiry_status: 2,
        follow_by: '',
        created_at: [],
        expired_date: [],
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: []
    };
  },
  computed: {
    status() {
      return this.$store.getters.getConstByGroup('status');
    },
    inquiryStatus() {
      return this.$store.getters.getConstByGroup('inquiry_status');
    }
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
      orderInquiryList(params).then(({ data }) => {
        this.tableData = data.data.map(v => ({
          ...v,
          showMinValidateDateTip: this.isLess2DayFromNow(v.min_validate_date)
        }));
        this.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    reset(params) {
      this.$refs.searchForm.resetFields();
      // 如果有筛选条件，重置后添加新的条件进行搜索
      if (params) {
        Object.assign(this.params, params);
      }
      this.search();
    },
    handleCurrentChange() {
      this.getList();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.getList();
    },
    watchEnquiry(row) {
      this.$router.push({
        path: '/order/enquiryPrice',
        query: {
          szlcsc_no: row.szlcsc_no,
          order_status: row.order_status
        }
      });
    },
    isLess2DayFromNow(dateStr) {
      if (!dateStr) return false;
      return dayjs().diff(dayjs(dateStr), 'day') <= 2;
    }
  }
};
</script>

<style lang="scss" scoped>
.booking-order {
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
