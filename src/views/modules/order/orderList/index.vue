<template>
  <div class="order-list">
    <el-form ref="searchForm" size="mini" :inline="true" :model="params">
      <el-form-item label="订单编号" prop="order_no">
        <el-input class="input-width" v-model.trim="params.order_no"></el-input>
      </el-form-item>
      <el-form-item label="国内订单号" prop="szlcsc_no">
        <el-input class="input-width" v-model.trim="params.szlcsc_no"></el-input>
      </el-form-item>
      <el-form-item label="批次号" prop="batch_no">
        <el-input class="input-width" v-model.trim="params.batch_no"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input class="input-width" v-model.trim="params.customer_code"></el-input>
      </el-form-item>
      <el-form-item label="跟进人" prop="follow_by">
        <el-input class="input-width" v-model.trim="params.follow_by"></el-input>
      </el-form-item>
      <el-form-item label="国家" prop="country_code">
        <el-select filterable clearable v-model="params.country_code">
          <el-option v-for="item in countryCode.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货方式" prop="express_code">
        <el-select placeholder="请选择" v-model="params.express_code">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in expressCode.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select placeholder="请选择" v-model="params.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in status.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订货状态" prop="inquiry_status">
        <el-select placeholder="请选择" v-model="params.inquiry_status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in inquiryStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂单状态" prop="delay_status">
        <el-select placeholder="请选择" v-model="params.delay_status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in delayStatus.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型" prop="customer_type">
        <el-select placeholder="请选择" v-model="params.customer_type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in customerType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单类型" prop="order_type">
        <el-select placeholder="请选择" v-model="params.order_type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in orderType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单分类" prop="type">
        <el-select placeholder="请选择" v-model="params.type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in type.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单方式" prop="created_type">
        <el-select placeholder="请选择" v-model="params.created_type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in createdType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="pay_type">
        <el-select placeholder="请选择" v-model="params.pay_type">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in payType.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="created_at">
        <el-date-picker
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
          v-model="params.created_at"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付时间" prop="paid_time">
        <el-date-picker
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
          v-model="params.paid_time"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付到期时间" prop="expired_date">
        <el-date-picker
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
          v-model="params.expired_date"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="warehouses">
        <el-checkbox-group v-model="params.warehouses">
          <el-checkbox label="hk">含香港仓物料</el-checkbox>
          <el-checkbox label="js">含江苏仓物料</el-checkbox>
          <el-checkbox label="sz">含深圳仓物料</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="" prop="intercept_status">
        <el-checkbox v-model="params.intercept_status">拦截中</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$hasPermission('searchOrderList')" @click="search">{{ $hasPermission('searchOrderList') }}</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="warning" size="mini" v-if="$hasPermission('cancelOrder')" @click="cancelOrder">{{ $hasPermission('cancelOrder') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('adjustExpiredTime')" @click="adjustExpiredTime">{{ $hasPermission('adjustExpiredTime') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('applyReturn')" @click="applyReturn">{{ $hasPermission('applyReturn') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('applyFree')" @click="applyFree">{{ $hasPermission('applyFree') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('applyRefund')" @click="openDialog('REFUND')">{{ $hasPermission('applyRefund') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('updateDeliverDate')" @click="updateDeliverDate">{{ $hasPermission('updateDeliverDate') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('updatePayMode')" @click="updatePayMode">{{ $hasPermission('updatePayMode') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('markPay')" @click="markPay">{{ $hasPermission('markPay') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('bindToSend')" @click="bindToSend">{{ $hasPermission('bindToSend') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('cancelBind')" @click="cancelBind">{{ $hasPermission('cancelBind') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('stopDelivery')" @click="stopDelivery(true)">{{ $hasPermission('stopDelivery') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('allowDelivery')" @click="stopDelivery(false)">{{ $hasPermission('allowDelivery') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('watchInvoice')" @click="watchInvoice">{{ $hasPermission('watchInvoice') }}</el-button>
      <el-button type="primary" size="mini" v-if="$hasPermission('downloadBom')" @click="downloadBom">{{ $hasPermission('downloadBom') }}</el-button>
    </div>
    <div class="font-12 p-t-10">
      订单总金额：<span class="font-red">${{ statistical.total || 0 }}</span>，
      销售客户量：<span class="font-red">{{ statistical.customer_count || 0 }}</span>，
      实际销售金额：<span class="font-red">${{ statistical.amount || 0 }}</span>，
      退款金额： <span class="font-red">${{ statistical.return_amount || 0 }}</span>,
    </div>
    <div class="p-t-10">
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
        <el-table-column label="客户编号" align="center" width="100px">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.customer_code }} </span>
              <span v-if="scope.row.is_head" class="font-red">(头部客户)</span>
            </div>
            <el-button type="text" size="mini" v-if="$hasPermission('searchOrderList')" @click="reset({customer_code: scope.row.customer_code})">历史订单</el-button>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" width="135px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="$hasPermission('orderDetail')" @click="toDetail(scope.row)">{{ scope.row.order_no }}</el-button>
            <div v-else>{{ scope.row.order_no }}</div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="expired_date" label="支付到期时间" align="center"></el-table-column>
        <el-table-column prop="status" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="type" label="订单分类" align="center"></el-table-column>
        <el-table-column prop="expected_delivery" label="订货预计交期" align="center"></el-table-column>
        <el-table-column label="应付金额" align="center">
          <template slot-scope="scope">
            <span>${{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pay_type_text" label="支付方式" align="center"></el-table-column>
        <el-table-column label="订货状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inquiry_status }}</span>
            <div v-if="scope.row.is_all_not_available" class="font-red">(全部无货)</div>
          </template>
        </el-table-column>
        <el-table-column prop="batch_no" label="批次号" align="center"></el-table-column>
        <el-table-column prop="express" label="发货方式" align="center"></el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openTrackingPage(scope.row.tracking_number_link)">{{ scope.row.tracking_number }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="follower" label="跟进人" align="center"></el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        v-if="tableData.length"
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
    <cancel-order
      v-if="dialog.show && dialog.name === 'CANCEL_ORDER'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </cancel-order>
    <delay-pay
      v-if="dialog.show && dialog.name === 'DELAY_PAY'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </delay-pay>
    <delivery-stop
      v-if="dialog.show && dialog.name === 'DELIVERY_STOP'"
      :visible="dialog.show"
      :isStop="deliveryStop.isStop"
      :order="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </delivery-stop>
    <apply-free
      v-if="dialog.show && dialog.name === 'APPLY_FREE'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </apply-free>
    <refund
      v-if="dialog.show && dialog.name === 'REFUND'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @cancel="closeDialog"
    >
    </refund>
    <deliver-date
      v-if="dialog.show && dialog.name === 'DELIVER_DATE'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </deliver-date>
    <payment-mode
      v-if="dialog.show && dialog.name === 'PAYMENT_MODE'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </payment-mode>
    <mark-pay
      v-if="dialog.show && dialog.name === 'MARK_PAY'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </mark-pay>
    <bind-send
      v-if="dialog.show && dialog.name === 'BIND_SEND'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @cancel="closeDialog"
    >
    </bind-send>
    <bind-send-cancel
      v-if="dialog.show && dialog.name === 'BIND_SEND_CANCEL'"
      :visible="dialog.show"
      :order="selectItems[0]"
      @cancel="closeDialog"
    >
    </bind-send-cancel>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';

import { orderIndex, orderCancel, bomDownload } from '@/api/order';

import cancelOrder from './components/cancel-order';
import delayPay from './components/delay-pay';
import deliveryStop from './components/delivery-stop';
import applyFree from './components/apply-free';
import refund from './components/refund';
import deliverDate from './components/deliver-date';
import paymentMode from './components/payment-mode';
import markPay from '../offlineRemittance/components/mark-pay';
import bindSend from './components/bind-send';
import bindSendCancel from './components/bind-send-cancel';

export default {
  name: 'orderList',
  components: {
    cancelOrder,
    delayPay,
    deliveryStop,
    applyFree,
    refund,
    deliverDate,
    paymentMode,
    markPay,
    bindSend,
    bindSendCancel,
  },
  data() {
    return {
      loading: false,
      params: {
        order_no: '',
        szlcsc_no: '',
        batch_no: '',
        customer_code: '',
        follow_by: '',
        country_code: '',
        express_code: '',
        status: '',
        inquiry_status: '',
        delay_status: '',
        intercept_status: '',
        customer_type: '',
        order_type: '',
        type: '',
        created_type: '',
        pay_type: '',
        created_at: [],
        paid_time: [],
        expired_date: [],
        warehouses: [],
        page: 1,
        limit: 10,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      statistical: {},
      deliveryStop: {
        isStop: true,
      },
      dialog: {
        show: false,
        name: '',
      },
    };
  },
  computed: {
    countryCode() {
      return this.$store.getters.getConstByGroup('country_code');
    },
    expressCode() {
      return this.$store.getters.getConstByGroup('express_code');
    },
    status() {
      return this.$store.getters.getConstByGroup('status');
    },
    inquiryStatus() {
      return this.$store.getters.getConstByGroup('inquiry_status');
    },
    delayStatus() {
      return this.$store.getters.getConstByGroup('order_list_delay_status');
    },
    customerType() {
      return this.$store.getters.getConstByGroup('customer_type');
    },
    orderType() {
      return this.$store.getters.getConstByGroup('order_type');
    },
    type() {
      return this.$store.getters.getConstByGroup('type');
    },
    createdType() {
      return this.$store.getters.getConstByGroup('created_type');
    },
    payType() {
      return this.$store.getters.getConstByGroup('pay_type');
    },
  },
  created() {
    if (Object.keys(this.$route.params).length) {
      Object.assign(this.params, this.$route.params);
    }
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
      if (params.intercept_status) {
        params.intercept_status = 2;
      } else {
        delete params.intercept_status;
      }
      this.loading = true;
      orderIndex(params).then(({ data }) => {
        this.tableData = data.listData.data;
        this.total = data.listData.total;
        this.statistical = data.statistical;
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
    cancelOrder() {
      if (!this.isSingle()) return;
      const { status, id } = this.selectItems[0];
      if (status === '已创建') {
        const h = this.$createElement;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          message: h('div', null, [
            h('p', null, `订单号：${this.selectItems[0].order_no}`),
            h('p', null, '此订单未支付，可直接取消，请确认是否需要取消订单？'),
          ]),
        }).then(() => {
          orderCancel(id).then(() => {
            this.$message.success('取消成功');
            this.actionSuccess();
          }).catch(() => {});
        }).catch(() => {});
        return;
      }
      this.openDialog('CANCEL_ORDER');
    },
    adjustExpiredTime() {
      if (!this.isSingle()) return;
      this.openDialog('DELAY_PAY');
    },
    stopDelivery(isStop) {
      if (!this.isSingle()) return;
      this.deliveryStop.isStop = isStop;
      this.openDialog('DELIVERY_STOP');
    },
    applyReturn() {
      if (!this.isSingle()) return;
      this.$router.push(`/order/applyReturn?orderId=${this.selectItems[0].id}`);
    },
    applyFree() {
      if (!this.isSingle()) return;
      this.openDialog('APPLY_FREE');
    },
    toDetail(row) {
      this.$router.push(`/order/orderDetail?orderId=${row.id}`);
    },
    openTrackingPage(url) {
      window.open(url);
    },
    updateDeliverDate() {
      if (!this.isSingle()) return;
      this.openDialog('DELIVER_DATE');
    },
    updatePayMode() {
      if (!this.isSingle()) return;
      this.openDialog('PAYMENT_MODE');
    },
    markPay() {
      if (!this.isSingle()) return;
      if (![5, 7].includes(this.selectItems[0].pay_type)) {
        this.$alert('只支持支付方式为月结和钱包余额的订单进行标记支付。', '异常提醒', {
          confirmButtonText: '确定',
        });
        return;
      }
      this.openDialog('MARK_PAY');
    },
    bindToSend() {
      if (!this.isSingle()) return;
      this.openDialog('BIND_SEND');
    },
    cancelBind() {
      if (!this.isSingle()) return;
      this.openDialog('BIND_SEND_CANCEL');
    },
    watchInvoice() {
      if (!this.isSingle()) return;
      window.open(this.selectItems[0].invoice_url);
    },
    downloadBom() {
      if (!this.isSingle()) return;
      bomDownload(this.selectItems[0].id)
        .then((res) => {
          const filename = res.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
          saveAs(res.data, decodeURI(filename));
        }).catch(() => {});
    },
    openDialog(name) {
      this.dialog.name = name;
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
    isSingle() {
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
.order-list {
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
