<style lang="scss" scoped>
.deliveryDetail{
  width: 100%;
  height: calc(100vh - 84px);
  overflow: auto;
  padding: 20px;
  font-size: 14px;
  box-sizing: border-box;
  .title {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
  }
  .cell {
    padding: 8px 15px;
    display: flex;
    align-items: center;
    word-break: break-all;
    box-shadow: 1px 1px 0 0 #d8dce5,
                1px 1px 0 0 #d8dce5 inset;
    &.justify-center {
      justify-content: center;
    }
  }
  .header-bg {
    background-color:#e6ebf5;
  }
}
.redtxt{
  color: #f00
}
.bluelink{
  color: #06f;
  cursor: pointer;
}
.mt20{
  margin-top: 20px;
}
</style>

<template>
  <div v-loading="loading" class="deliveryDetail">
    <el-row type="flex" justify="space-between">
      <el-button
        type="info"
        size="mini"
        icon="el-icon-back"
        @click="goBack()"
      >
        返回
      </el-button>
    </el-row>

    <!-- 基本信息 -->
    <div v-if="detail.basic">
      <div class="title">
        基本信息
      </div>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          批次号
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.batch_no }}
        </el-col>
        <el-col class="cell" :span="6">
          客编
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.customer_code }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          创建时间
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.created_at }}
        </el-col>
        <el-col class="cell" :span="6">
          批次状态
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.status_text }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          订单数
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.order_count }}
        </el-col>
        <el-col class="cell" :span="6">
          商品种类
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.product_count }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          运费类型
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.freight_type_text }}
        </el-col>
        <el-col class="cell" :span="6">
          物流渠道
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.express_forwarder_text }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          物流单号
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.tracking_number }}
        </el-col>
        <el-col class="cell" :span="6">
          是否购买保险
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.insurance ? '是' : '否' }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          批次原重量（kg）
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.original_weight }}
        </el-col>
        <el-col class="cell" :span="6">
          实际称重重量（kg）
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.real_weight }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          件数
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.package_count }}
        </el-col>
        <el-col class="cell" :span="6">
          包裹长宽高(mm) / 体积重(kg)
        </el-col>
        <el-col class="cell" :span="6">
          <div>
            <div v-for="(item, idx) in detail.basic.package_info" :key="idx">
              {{ item }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          货柜号
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.cabinet }}
        </el-col>
        <el-col class="cell" :span="6">
          发货时间
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.basic.send_at }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          发货备注
        </el-col>
        <el-col class="cell" :span="18">
          <div>
            <div class="redtxt">
              {{ detail.basic.fail_record_text }}
            </div>
            <div v-for="(item, idx) in detail.basic.delivery_remarks" :key="idx">
              {{ item }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 费用信息 -->
    <div v-if="detail.cost">
      <div class="title">
        费用信息
      </div>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          批次总金额
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.batch_total_amount }}
        </el-col>
        <el-col class="cell" :span="6">
          申报金额
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.declare_amount }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          原运费
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.original_freight }}
        </el-col>
        <el-col class="cell" :span="6">
          实际称重运费
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.real_paid_freight }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          实付运费
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.real_freight }}
        </el-col>
        <el-col class="cell" :span="6">
          实付手续费
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.real_paid_fee }}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="6">
          账单运费(CNY)
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.billing_cost }}
        </el-col>
        <el-col class="cell" :span="6">
          账单计费重量(kg)
        </el-col>
        <el-col class="cell" :span="6">
          {{ detail.cost.billing_weight }}
        </el-col>
      </el-row>
    </div>

    <!-- 地址信息 -->
    <div v-if="detail.addresses">
      <div class="title">
        <span>地址信息</span>
        <div class="fr">
          <el-button
            v-if="detail.basic && detail.basic.express_forwarder_text == 'SF'"
            size="mini"
            type="primary"
            @click="editCnAddressFn()"
          >
            填写中文地址
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editAddressFn()"
          >
            修改地址
          </el-button>
        </div>
      </div>
      <el-row type="flex">
        <el-col class="cell justify-center header-bg" :span="12">
          收货地址
        </el-col>
        <el-col class="cell justify-center header-bg" :span="12">
          账单地址
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="cell" :span="12">
          <div v-if="detail.addresses.shipping_address">
            <div>First Name：{{ detail.addresses.shipping_address.first_name }}</div>
            <div>Last Name：{{ detail.addresses.shipping_address.last_name }}</div>
            <div>Phone：{{ detail.addresses.shipping_address.phone }}</div>
            <div>Country：{{ detail.addresses.shipping_address.country }}</div>
            <div>State：{{ detail.addresses.shipping_address.state }}</div>
            <div>City：{{ detail.addresses.shipping_address.city }}</div>
            <div>Apt, Suite, Building：{{ detail.addresses.shipping_address.street }}</div>
            <div>Street Address：{{ detail.addresses.shipping_address.street2 }}</div>
            <div>Postal Code：{{ detail.addresses.shipping_address.postcode }}</div>
            <div>
              <span>Company：</span>
              <span>
                {{ str2starFn(detail.addresses.shipping_address.company, detail.addresses.shipping_address.hiddenA) }}
                <el-button
                  v-if="!detail.addresses.shipping_address.hiddenA"
                  type="text"
                  size="mini"
                  @click="$set(detail.addresses.shipping_address, 'hiddenA', true)"
                >查看</el-button>
              </span>
            </div>
            <div>VAT：{{ detail.addresses.shipping_address.vat_code }}</div>
            <div>类VAT信息：{{ detail.addresses.shipping_address.tax_info }}</div>
            <div
              v-if="detail.addresses.cn_address && (detail.addresses.cn_address.addressee_cn || detail.addresses.cn_address.country_cn || detail.addresses.cn_address.province_cn || detail.addresses.cn_address.city_cn || detail.addresses.cn_address.street_cn || detail.addresses.cn_address.company_cn)"
              class="mt20"
            >
              <span>中文地址：</span>
              <span>
                {{ null2nostrFn(detail.addresses.cn_address.addressee_cn) + '，' + null2nostrFn(detail.addresses.cn_address.country_cn) + null2nostrFn(detail.addresses.cn_address.province_cn) + null2nostrFn(detail.addresses.cn_address.city_cn) + null2nostrFn(detail.addresses.cn_address.street_cn) + '，' + null2nostrFn(detail.addresses.cn_address.company_cn) }}
              </span>
            </div>
          </div>
        </el-col>
        <el-col class="cell" :span="12">
          <div v-if="detail.addresses.bill_address">
            <div>First Name：{{ detail.addresses.bill_address.first_name }}</div>
            <div>Last Name：{{ detail.addresses.bill_address.last_name }}</div>
            <div>Phone：{{ detail.addresses.bill_address.phone }}</div>
            <div>Country：{{ detail.addresses.bill_address.country }}</div>
            <div>State：{{ detail.addresses.bill_address.state }}</div>
            <div>City：{{ detail.addresses.bill_address.city }}</div>
            <div>Apt, Suite, Building：{{ detail.addresses.bill_address.street }}</div>
            <div>Street Address：{{ detail.addresses.bill_address.street2 }}</div>
            <div>Postal Code：{{ detail.addresses.bill_address.postcode }}</div>
            <div>
              <span>Company：</span>
              <span>
                {{ str2starFn(detail.addresses.bill_address.company, detail.addresses.bill_address.hiddenB) }}
                <el-button
                  v-if="!detail.addresses.bill_address.hiddenB"
                  type="text"
                  size="mini"
                  @click="$set(detail.addresses.bill_address, 'hiddenB', true)"
                >查看</el-button>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 商品发货明细 -->
    <div v-if="detail.products">
      <div class="title">
        商品发货明细
      </div>
      <el-table
        border
        size="mini"
        :max-height="480"
        :data="detail.products"
        @selection-change="(val) => { }"
      >
        <el-table-column
          width="55px"
          type="index"
          label="序号"
          align="center"
        />
        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <div class="bluelink" @click="toDetail(scope.row)">
              {{ scope.row.order_no }}
            </div>
            <div>{{ scope.row.szlcsc_no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.product_number }}</div>
            <div v-if="scope.row.has_reel == 1" class="redtxt">
              （Reel服务）
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cate_name"
          label="商品目录"
          align="center"
        />
        <el-table-column label="厂商型号/客户参考号" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.mpn }}</div>
            <div>{{ scope.row.customer_tag }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="brand_name"
          label="品牌"
          align="center"
        />
        <el-table-column
          prop="price"
          label="单价(USD)"
          align="center"
        />
        <el-table-column
          prop="total_price"
          label="发货金额(USD)"
          align="center"
        />
        <el-table-column
          prop="quantity"
          label="发货数量"
          align="center"
        />
        <el-table-column
          prop="weight"
          label="重量(g)"
          align="center"
        />
      </el-table>
    </div>

    <!-- 填写中文地址 -->
    <editCnAddressDialog ref="editCnAddressDialog" />
    <!-- 修改地址 -->
    <editAddressDialog ref="editAddressDialog" />
  </div>
</template>

<script>
import { getDeliveryDetail } from '@/api/deliveryManagement';
import editCnAddressDialog from '@/views/modules/deliveryManagement/deliveryDetail/components/editCnAddressDialog.vue';
import editAddressDialog from '@/views/modules/deliveryManagement/deliveryDetail/components/editAddressDialog.vue';

export default {
  name: 'deliveryDetail',
  components: {
    editCnAddressDialog,
    editAddressDialog,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      detail: {
        addresses: {}, // 地址信息
        basic: {}, // 基本信息
        cost: {}, // 费用信息
        products: [], // 商品发货明细
      },
    };
  },
  created() {
    this.loading = true;
    getDeliveryDetail(this.id).then(({ data }) => {
      this.detail = data;
    }).finally(() => {
      this.loading = false;
    });
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    // 字符串转换为*号   flag为true就鸳原样输出
    str2starFn(str, flag) {
      return flag ? str : str.replace(/./g, '*');
    },

    // 字段值为null的转为空字符串
    null2nostrFn(str) {
      return str === null ? '' : str;
    },

    // 进入订单详情
    toDetail(row) {
      this.$router.push({ name: 'orderDetail', query: { orderId: row.order_no }});
    },

    // 填写中文地址
    editCnAddressFn() {
      this.$refs.editCnAddressDialog.show({
        id: this.id,
        shipping_address: this.detail.addresses.shipping_address,
        cn_address: this.detail.addresses.cn_address,
      }, (data) => {
        this.detail.addresses.cn_address = { ...this.detail.addresses.cn_address, ...data };
      });
    },

    // 修改地址
    editAddressFn() {
      this.$refs.editAddressDialog.show({
        id: this.id,
        shipping_address: this.detail.addresses.shipping_address,
        bill_address: this.detail.addresses.bill_address,
      }, (data) => {
        if (data.type === '1') {
          this.detail.addresses.shipping_address = { ...this.detail.addresses.shipping_address, ...data };
        }
        if (data.type === '2') {
          this.detail.addresses.bill_address = { ...this.detail.addresses.bill_address, ...data };
        }
      });
    },
  },
};
</script>
