<template>
  <base-wrapper v-loading="loading">
    <el-row slot="head">
      <el-button type="info" size="mini" icon="el-icon-back" @click="back">返回</el-button>
    </el-row>
    <div class="order-detail">
      <div>
        <div class="title">基本信息</div>
        <el-row type="flex">
          <el-col class="cell" :span="6">订单编号</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.order_no }}</el-col>
          <el-col class="cell" :span="6">国内订单编号</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.szlcsc_no }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">下单时间</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.created_at }}</el-col>
          <el-col class="cell" :span="6">下单方式</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.created_type }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">订单分类</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.type }}</el-col>
          <el-col class="cell" :span="6">下单类型</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.order_type }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">订单状态</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.status }}</el-col>
          <el-col class="cell" :span="6">订货状态</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.inquiry_status }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">支付到期时间</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.expired_date }}</el-col>
          <el-col class="cell" :span="6">订货预计交期</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.expected_delivery }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">支付方式</el-col>
          <el-col class="cell" :span="6">
            <span>{{ detail.basic.pay_type }}</span>
            <el-button class="btn-margin" size="mini" type="text">查看支付信息</el-button>
          </el-col>
          <el-col class="cell" :span="6">支付时间</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.pay_time }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">商品种类</el-col>
          <el-col class="cell" :span="6">
            <span>现货（{{ detail.basic.in_stock_count || 0 }}）</span>
            <span>订货（{{ detail.basic.back_order_count || 0 }}）</span>
          </el-col>
          <el-col class="cell" :span="6">商品总重（g）</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.weight_total }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">拦截状态</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.intercept_status }}</el-col>
          <el-col class="cell" :span="6">挂单状态</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.delay_status }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">跟进人</el-col>
          <el-col class="cell" :span="6">{{ detail.basic.follower }}</el-col>
          <el-col class="cell" :span="6" />
          <el-col class="cell" :span="6" />
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">
            <span>订单备注</span>
            <el-button class="btn-margin" type="text" size="mini" @click="addOrderRemark(1)">新增订单备注</el-button>
          </el-col>
          <el-col class="cell justify-start" :span="18">
            <remark-list v-if="detail.basic.order_remarks" :remark-list="detail.basic.order_remarks" />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">
            <span>发货备注</span>
            <el-button class="btn-margin" type="text" size="mini" @click="addOrderRemark(2)">新增发货备注</el-button>
          </el-col>
          <el-col class="cell justify-start" :span="18">
            <remark-list v-if="detail.basic.shipping_remarks" :remark-list="detail.basic.shipping_remarks" />
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="title">费用信息</div>
        <el-row type="flex">
          <el-col class="cell header-bg" :span="6">原始费用</el-col>
          <el-col class="cell header-bg" :span="6">优惠费用</el-col>
          <el-col class="cell header-bg" :span="6">支付费用</el-col>
          <el-col class="cell header-bg" :span="6">人民币换算/退款</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="3">订单原价</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.total_cost }}</el-col>
          <el-col class="cell" :span="3">总优惠</el-col>
          <el-col class="cell" :span="3">
            <span>${{ detail.cost.off }}</span>
            <el-button class="btn-margin" type="text" size="mini" @click="openDialog('INFO_DIALOG')">查看优惠明细</el-button>
          </el-col>
          <el-col class="cell" :span="3">应付金额</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.need_pay_total }}</el-col>
          <el-col class="cell" :span="3">人民币换算金额</el-col>
          <el-col class="cell" :span="3">
            <span v-if="detail.cost.convert_total">￥{{ detail.cost.convert_total }}</span>
            <el-button v-if="detail.cost.is_lock_convert === 1" class="btn-margin" type="text" size="mini" @click="convertToRmb">换算人民币</el-button>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="3">商品原价</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.product_cost }}</el-col>
          <el-col class="cell" :span="3">商品优惠</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.product_off }}</el-col>
          <el-col class="cell" :span="3">退款账户余额支付</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.refund_account_payment }}</el-col>
          <el-col class="cell" :span="3">换算汇率</el-col>
          <el-col class="cell" :span="3">
            <span>{{ detail.cost.convert_rate }}</span>
            <el-button class="btn-margin" type="text" size="mini" @click="lockOrUnlock">{{ detail.cost.is_lock_convert === 1 ? '锁定换算' : '解锁换算' }}</el-button>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="3">运费原价</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.shipment_cost }}</el-col>
          <el-col class="cell" :span="3">运费优惠</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.shipment_off }}</el-col>
          <el-col class="cell" :span="3">应收金额</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.total }}</el-col>
          <el-col class="cell" :span="3">退款金额</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.refund_total }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="3">手续费原价</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.handle_fee }}</el-col>
          <el-col class="cell" :span="3">手续费优惠</el-col>
          <el-col class="cell" :span="3">${{ detail.cost.handle_fee_off }}</el-col>
          <el-col class="cell" :span="12" />
        </el-row>
      </div>
      <div>
        <div class="title">客户和物流信息</div>
        <el-row type="flex">
          <el-col class="cell" :span="6">客户编号</el-col>
          <el-col class="cell" :span="6">{{ detail.customer_and_express.customer }}</el-col>
          <el-col class="cell" :span="6">批次号</el-col>
          <el-col class="cell" :span="6">
            <!-- <el-button size="mini" type="text">{{ detail.customer_and_express.batch_no }}</el-button> -->
            <span class="font-blue">{{ detail.customer_and_express.batch_no }}</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">客户名称</el-col>
          <el-col class="cell" :span="6">{{ detail.customer_and_express.customer_name }}</el-col>
          <el-col class="cell" :span="6">发货类型</el-col>
          <el-col class="cell" :span="6">{{ detail.customer_and_express.shipment_type }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">客户类型</el-col>
          <el-col class="cell" :span="6">{{ detail.customer_and_express.customer_type }}</el-col>
          <el-col class="cell" :span="6">发货方式</el-col>
          <el-col class="cell" :span="6">{{ detail.customer_and_express.express }}</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell" :span="6">客户邮箱</el-col>
          <el-col class="cell" :span="6">
            <span>{{ detail.customer_and_express.email }}</span>
            <el-button class="btn-margin" type="text" size="mini" @click="getEmail">查看</el-button>
          </el-col>
          <el-col class="cell" :span="6">物流单号</el-col>
          <el-col class="cell" :span="6">
            <el-button type="text" size="mini" @click="openPage(scope.row.tracking_number_link)">{{ detail.customer_and_express.tracking_number }}</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="title">地址信息</div>
        <el-row type="flex">
          <el-col class="cell header-bg" :span="12">收货地址</el-col>
          <el-col class="cell header-bg" :span="12">账单地址</el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="cell justify-start" :span="12">
            <div>
              <div>First Name：{{ detail.addresses.receipt_address.first_name }}</div>
              <div>Last Name：{{ detail.addresses.receipt_address.last_name }}</div>
              <div>Phone：{{ detail.addresses.receipt_address.phone }}</div>
              <div>Country：{{ detail.addresses.receipt_address.country }}</div>
              <div>State：{{ detail.addresses.receipt_address.state }}</div>
              <div>City：{{ detail.addresses.receipt_address.city }}</div>
              <div>Apt, Suite, Building：{{ detail.addresses.receipt_address.street }}</div>
              <div>Street Address：{{ detail.addresses.receipt_address.street2 }}</div>
              <div>Postal Code：{{ detail.addresses.receipt_address.postcode }}</div>
              <div>
                <span>Company：</span>
                <span>
                  {{ detail.addresses.receipt_address.company }}
                  <el-button type="text" size="mini" @click="watchCompany(1)">查看</el-button>
                </span>
              </div>
              <div>VAT：{{ detail.addresses.receipt_address.vat_code }}</div>
              <div>类VAT信息：{{ detail.addresses.receipt_address.tax_info }}</div>
            </div>
          </el-col>
          <el-col class="cell justify-start" :span="12">
            <div>
              <div>First Name：{{ detail.addresses.bill_address.first_name }}</div>
              <div>Last Name：{{ detail.addresses.bill_address.last_name }}</div>
              <div>Phone：{{ detail.addresses.bill_address.phone }}</div>
              <div>Country：{{ detail.addresses.bill_address.phone }}</div>
              <div>State：{{ detail.addresses.bill_address.state }}</div>
              <div>City：{{ detail.addresses.bill_address.city }}</div>
              <div>Apt, Suite, Building：{{ detail.addresses.bill_address.street }}</div>
              <div>Street Address：{{ detail.addresses.bill_address.street2 }}</div>
              <div>Postal Code：{{ detail.addresses.bill_address.postcode }}</div>
              <div>
                <span>Company：</span>
                <span>
                  {{ detail.addresses.bill_address.company }}
                  <el-button type="text" size="mini" @click="watchCompany(2)">查看</el-button>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="title">
          <span>商品信息</span>
          <div class="fr">
            <el-button v-if="$hasPermission('updateShipQuntity')" size="mini" type="primary" @click="editSendCount">{{ $hasPermission('updateShipQuntity') }}</el-button>
          </div>
        </div>
        <el-table
          border
          size="mini"
          :max-height="480"
          :data="detail.products"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column width="55px" type="selection" align="center" />
          <el-table-column width="55px" type="index" label="序号" align="center" />
          <el-table-column label="商品编号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.product_number }}</div>
              <div v-if="scope.row.is_back_order" class="font-red">(订货)</div>
              <div v-if="scope.row.showDelayStatus" class="font-red">({{ scope.row.delayStatusText }})</div>
            </template>
          </el-table-column>
          <el-table-column label="厂商型号/品牌/客户参考号" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.mpn }}</div>
              <div>{{ scope.row.brand }}</div>
              <div>{{ scope.row.customer_tag }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="categories" label="商品目录" align="center" />
          <el-table-column prop="quantity" label="下单数量" align="center" />
          <el-table-column label="仓库信息" align="center">
            <template slot-scope="scope">
              <div>深圳：{{ scope.row.warehouse_sz }}</div>
              <div>江苏：{{ scope.row.warehouse_js }}</div>
              <div>香港：{{ scope.row.warehouse_hk }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价(USD)" align="center" />
          <el-table-column prop="total_price" label="金额(USD)" align="center" />
          <el-table-column prop="total_off" label="优惠金额(USD)" align="center" />
          <el-table-column prop="shipment_quantity" label="发货数量" align="center" />
          <el-table-column prop="split_shipment_quantity" label="拆单补发数量" align="center" />
          <el-table-column prop="weight_total" label="系统重量(g)" align="center" />
          <el-table-column label="是否Real服务" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.is_reel ? '是' : '否' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="BOM搜索" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.is_bom ? '是' : '否' }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <remark-dialog
        v-if="dialog.show && dialog.name === 'REARK_DIALOG'"
        :visible="dialog.show"
        :order-id="detail.basic.id"
        :type="remarkDialogType"
        @success="actionSuccess"
        @cancel="closeDialog"
      />
      <info-dialog
        v-if="dialog.show && dialog.name === 'INFO_DIALOG'"
        :visible="dialog.show"
        :order-id="detail.basic.id"
        @cancel="closeDialog"
      />
      <edit-send-count
        v-if="dialog.show && dialog.name === 'EDIT_SEND_COUNT'"
        :visible="dialog.show"
        :products="selectItems"
        :order-info="detail.basic"
        @success="actionSuccess"
        @cancel="closeDialog"
      />
    </div>
  </base-wrapper>
</template>

<script>
import {
  orderDetail,
  getOrderEmail,
  convertRmb,
  lockConvert,
  getOrderCompany
} from '@/api/order';

import remarkDialog from './components/remark-dialog';
import infoDialog from './components/info-dialog';
import editSendCount from './components/edit-send-count';
// import remarkList from '@/components/commons/remark-list';

export default {
  components: {
    remarkDialog,
    infoDialog,
    editSendCount
    // remarkList,
  },
  data() {
    return {
      loading: false,
      dialog: {
        show: false,
        name: ''
      },
      detail: {
        basic: {},
        addresses: {
          bill_address: {},
          receipt_address: {}
        },
        cost: {},
        customer_and_express: {},
        products: []
      },
      productList: [],
      selectItems: [],
      remarkDialogType: ''
    };
  },
  computed: {
    delayStatus() {
      return this.$store.getters.getConstByGroup('delay_status');
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      if (!this.$route.query.orderId) return;
      this.loading = true;
      orderDetail(this.$route.query.orderId)
        .then((res) => {
          this.detail = {
            ...res.data,
            addresses: {
              bill_address: res.data.addresses.bill_address || {},
              receipt_address: res.data.addresses.receipt_address || {}
            },
            products: res.data.products.map(v => ({
              ...v,
              showDelayStatus: [2, 3].includes(v.delay_status),
              delayStatusText: this.delayStatus[v.delay_status]
            }))
          };
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    back() {
      this.$router.go(-1);
    },
    addOrderRemark(type) {
      this.remarkDialogType = type;
      this.openDialog('REARK_DIALOG');
    },
    actionSuccess() {
      this.getDetail();
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
    getEmail() {
      getOrderEmail(this.detail.basic.id)
        .then(({ data }) => {
          this.detail.customer_and_express.email = data.email;
        })
        .catch(() => {});
    },
    watchCompany(type) {
      getOrderCompany(this.detail.basic.id, { type }).then(({ data }) => {
        const objKey = type === 1 ? 'receipt_address' : 'bill_address';
        this.detail.addresses[objKey].company = data.company;
      }).catch(() => {});
    },
    convertToRmb() {
      convertRmb(this.detail.basic.id)
        .then(() => {
          this.getDetail();
        })
        .catch(() => {});
    },
    lockOrUnlock() {
      const params = {
        is_lock: this.detail.cost.is_lock_convert === 1 ? 2 : 1
      };
      lockConvert(this.detail.basic.id, params)
        .then(() => {
          this.getDetail();
        })
        .catch(() => {});
    },
    openPage(url) {
      window.open(url);
    },
    editSendCount() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择');
        return;
      }
      this.openDialog('EDIT_SEND_COUNT');
    }
  }
};
</script>

<style lang="scss" scoped>
.order-detail {
  width: 100%;
  .title {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
  }
  .cell {
    font-size: 14px;
    min-height: 32px;
    padding: 5px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    word-break: break-all;
    box-shadow: 1px 1px 0 0 #d8dce5,
                1px 1px 0 0 #d8dce5 inset;
    &.justify-start {
      justify-content: flex-start;
    }
  }
  .header-bg {
    background-color:#e6ebf5;
  }
  .btn-margin {
    margin-left: 8px;
  }
}
</style>
