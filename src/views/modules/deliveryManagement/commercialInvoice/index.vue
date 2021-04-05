<style lang="scss" scoped>
.commercialInvoice{
  // width: 720px;
  width: 1000px;
  height: 100%;
  overflow: auto;
  padding: 20px;
  font-size: 14px;
}
</style>

<style lang="scss">
.tabledetailwrap{
  width: 100%;
  font-size: 14px;
  -webkit-print-color-adjust: exact;
  .tabletitle{
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 21px;
  }
  table{
    width: 100%;
    border-top: 1px solid #a1a1a1;
    border-left: 1px solid #a1a1a1;
    td{
      border-right: 1px solid #a1a1a1;
      border-bottom: 1px solid #a1a1a1;
      padding: 7px 10px;
    }
    .titwrap{
      background: #e4e4e4;
      text-align: center;
    }
    p{
      margin: 0 0 10px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
</style>

<template>
  <div v-loading="loading" class="commercialInvoice">
    <el-row type="flex" justify="space-between" style="margin-bottom: 20px;">
      <el-button
        type="info"
        size="mini"
        icon="el-icon-back"
        @click="goBack()"
      >
        返回
      </el-button>
      <span>
        <el-button
          type="primary"
          size="mini"
          @click="saveFn()"
        >
          保存修改
        </el-button>
        <el-button
          type="primary"
          size="mini"
          v-print="'#tabledetailwrap'"
        >
          打印
        </el-button>
      </span>
    </el-row>

    <div class="tabledetailwrap" id="tabledetailwrap">
      <div class="tabletitle">
        COMMERCIAL INVOICE
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td colspan="4" style="vertical-align: top;">
            <p>Invoice Date</p>
            <p><editSpan v-model="detail.invoice_date" /></p>
          </td>
          <td colspan="4" style="vertical-align: top;">
            <p>Invoice No.</p>
            <p><editSpan v-model="detail.invoice_no" /></p>
          </td>
          <td colspan="4" style="vertical-align: top;">
            <p>Other Reference</p>
            <p><editSpan v-model="detail.other_reference" /></p>
          </td>
        </tr>
        <tr>
          <td colspan="6" width="50%" style="vertical-align: top;">
            <p style="font-weight: bold;">Shipper</p>
            <p><editSpan v-model="detail.ship_from.company" /></p>
            <p>ATTN: <editSpan v-model="detail.ship_from.attn" /></p>
            <p><editSpan v-model="detail.ship_from.street" /></p>
            <p><editSpan v-model="detail.ship_from.city" /> <editSpan v-model="detail.ship_from.postal_code" /></p>
            <p><editSpan v-model="detail.ship_from.country" /></p>
            <p>Phone: <editSpan v-model="detail.ship_from.phone" /></p>
            <p>VAT: <editSpan v-model="detail.ship_from.vat" /></p>
          </td>
          <td colspan="6" width="50%" style="vertical-align: top;">
            <p style="font-weight: bold;">Consignee</p>
            <p><editSpan v-model="detail.ship_to.company" /></p>
            <p>ATTN: <editSpan v-model="detail.ship_to.attn" /></p>
            <p><editSpan v-model="detail.ship_to.street" />, <editSpan v-model="detail.ship_to.street2" /></p>
            <p><editSpan v-model="detail.ship_to.city" />, <editSpan v-model="detail.ship_to.state" />, <editSpan v-model="detail.ship_to.postal_code" /></p>
            <p><editSpan v-model="detail.ship_to.country" /></p>
            <p>Phone: <editSpan v-model="detail.ship_to.phone" /></p>
          </td>
        </tr>
        <tr>
          <td colspan="6" style="vertical-align: top;">
            <p>Air Waybill Number</p>
            <p><editSpan v-model="detail.tracking_number" /></p>
          </td>
          <td colspan="6" style="vertical-align: top;">
            <p>Freight</p>
            <p :key="totalKey">
              <label><input @click="toggleFreight(1)" :checked="detail.freight === 1" type="checkbox"> Prepaid</label>
              <label style="margin-left: 56px;"><input @click="toggleFreight(2)" :checked="detail.freight === 2" type="checkbox"> Collect</label>
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="3" style="vertical-align: top;">
            <p>Shipment Via</p>
            <p><editSpan v-model="detail.shipment_via" /></p>
          </td>
          <td colspan="3" style="vertical-align: top;">
            <p>Date of Shipment</p>
            <p><editSpan v-model="detail.shipment_date" /></p>
          </td>
          <td colspan="3" style="vertical-align: top;">
            <p>Terms of Shipment</p>
            <p><editSpan v-model="detail.shipment_terms_text" /></p>
          </td>
          <td colspan="3" style="vertical-align: top;">
            <p>Terms of Payment</p>
            <p><editSpan v-model="detail.payment_terms_text" /></p>
          </td>
        </tr>
        <tr>
          <td colspan="3" style="vertical-align: top;">
            <p>Currency</p>
            <p><editSpan v-model="detail.currency" /></p>
          </td>
          <td colspan="3" style="vertical-align: top;">
            <p>Customer PO No.</p>
            <p><editSpan v-model="detail.customer_po_no" /></p>
          </td>
          <td colspan="6" style="vertical-align: top;">
            <p>VAT/ EORI/ KYC No.</p>
            <p><editSpan v-model="detail.vat" /></p>
          </td>
        </tr>

        <!-- TNT、FedEx随货发票 -->
        <template v-if="[6, 7, '6', '7'].includes($route.query.express_forwarder_type)">
          <tr class="titwrap">
            <td>No.</td>
            <td colspan="5">Full Description of Goods</td>
            <td>Qty.</td>
            <td colspan="2">Unit Value</td>
            <td>Amount</td>
            <td colspan="2">Country of Origin</td>
          </tr>
          <tr align="center" v-for="(v, i) in detail.products" :key="i">
            <td>{{ i + 1 }}</td>
            <td colspan="5" align="left">
              <p><editSpan v-model="v.cate_name" /></p>
              <p>Mfr. Part #: <editSpan v-model="v.mfr_part" /></p>
              <p>Customer #: <editSpan v-model="v.customer" /></p>
            </td>
            <td><editSpan v-model="v.shipped" /></td>
            <td colspan="2"><editSpan v-model="v.unit_value" /></td>
            <td><editSpan v-model="v.amount" /></td>
            <td colspan="2"><editSpan v-model="v.origin_country" /></td>
          </tr>
          <tr align="center">
            <td colspan="6" align="right">Total</td>
            <td>{{ addFn(detail.products, 'shipped') }}</td>
            <td colspan="2"></td>
            <td>{{ addFn(detail.products, 'amount') }}</td>
            <td colspan="2"></td>
          </tr>
          <!-- 客户到付就显示这条信息 -->
          <tr v-if="[6, '6'].includes($route.query.express_forwarder_type) && [2, '2'].includes($route.query.freight_type)">
            <td colspan="12">Material: Metal & Plastic | Use: Electronic devices</td>
          </tr>
          <tr>
            <td rowspan="3" colspan="9">I/ We declare all the information contained in this invoice to be true and correct.</td>
            <td colspan="2">Total Value</td>
            <td><editSpan v-model="detail.total_value" /></td>
          </tr>
          <tr>
            <td colspan="2">Total Cartons</td>
            <td><editSpan v-model="detail.total_cartons" /></td>
          </tr>
          <tr>
            <td colspan="2">Total Gross Weight</td>
            <td><editSpan v-model="detail.total_gross_weight" /> kg</td>
          </tr>
        </template>

        <template v-else>
          <tr class="titwrap">
            <td>No.</td>
            <td colspan="4">Full Description of Goods</td>
            <td>Qty.</td>
            <td>Unit Value</td>
            <td>Amount</td>
            <td>Shipping Cost</td>
            <td>Total</td>
            <td colspan="2">Country of Origin</td>
          </tr>
          <tr align="center" v-for="(v, i) in detail.products" :key="i">
            <td>{{ i + 1 }}</td>
            <td colspan="4" align="left">
              <p><editSpan v-model="v.cate_name" /></p>
              <p>Mfr. Part #: <editSpan v-model="v.mfr_part" /></p>
              <p>Customer #: <editSpan v-model="v.customer" /></p>
            </td>
            <td><editSpan v-model="v.shipped" /></td>
            <td><editSpan v-model="v.unit_value" /></td>
            <td><editSpan v-model="v.amount" /></td>
            <td><editSpan v-model="v.shipping_cost" /></td>
            <td><editSpan v-model="v.total" /></td>
            <td colspan="2"><editSpan v-model="v.origin_country" /></td>
          </tr>
          <tr align="center">
            <td colspan="5" align="right">Total</td>
            <td>{{ addFn(detail.products, 'shipped') }}</td>
            <td></td>
            <td>{{ addFn(detail.products, 'amount') }}</td>
            <td>{{ addFn(detail.products, 'shipping_cost') }}</td>
            <td>{{ addFn(detail.products, 'total') }}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td rowspan="5" colspan="8">I/ We declare all the information contained in this invoice to be true and correct.</td>
            <td colspan="2">Merchandise Total</td>
            <td colspan="2">{{ addFn(detail.products, 'total') }}</td>
          </tr>
          <tr>
            <td colspan="2">Shipping Cost</td>
            <td colspan="2">{{ addFn(detail.products, 'shipping_cost') }}</td>
          </tr>
          <tr>
            <td colspan="2">Total Value</td>
            <td colspan="2"><editSpan v-model="detail.total_value" /></td>
          </tr>
          <tr>
            <td colspan="2">Total Cartons</td>
            <td colspan="2"><editSpan v-model="detail.total_cartons" /></td>
          </tr>
          <tr>
            <td colspan="2">Total Gross Weight</td>
            <td colspan="2"><editSpan v-model="detail.total_gross_weight" /> kg</td>
          </tr>
        </template>

        <tr>
          <td colspan="4" style="padding-bottom: 70px; vertical-align: top;">
            <p>Name of Company</p>
            <p><editSpan v-model="detail.ship_from.company" /></p>
          </td>
          <td colspan="4" style="vertical-align: top;">Signature</td>
          <td colspan="4" style="vertical-align: top;">Company Stamp</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getCommercialInvoice, updateCommercialInvoice } from '@/api/deliveryManagement';
import calculator from '@/utils/calculator';
import print from '@/utils/printJs/print.js';
import editSpan from '@/views/modules/deliveryManagement/components/editSpan.vue';

export default {
  name: 'commercialInvoice',
  directives: {
    print,
  },
  components: {
    editSpan,
  },
  data() {
    return {
      loading: false,
      id: this.$route.query.id,
      detail: {
        ship_to: {},
        ship_from: {},
        products: [],
      },

      totalKey: 1,

      // 计算插件
      calculator,
    };
  },
  created() {
    this.loading = true;
    getCommercialInvoice(this.id).then(({ data }) => {
    // const data = {
    //   'id': 1,
    //   'invoice_date': '2020-10-11',
    //   'invoice_no': '200618QJOU',
    //   'other_reference': '2307401A-0036',
    //   'tracking_number': '6728946534',
    //   'freight': 1,
    //   'freight_text': 'Prepaid',
    //   'shipment_via': null,
    //   'shipment_date': '2020-10-10',
    //   'shipment_terms': 1,
    //   'shipment_terms_text': 'DAP',
    //   'payment_terms': 1,
    //   'payment_terms_text': '100% Prepaid',
    //   'currency': 'USD',
    //   'customer_po_no': '',
    //   'vat': '',
    //   'total_value': '17.92',
    //   'total_cartons': 1,
    //   'total_gross_weight': '30.060',
    //   'ship_to': {
    //     'company': 'BaltElektronics UAB',
    //     'attn': 'Darius Sapola',
    //     'street': 'Metalo 21',
    //     'street2': '',
    //     'city': 'Vilnius',
    //     'state': '',
    //     'postal_code': 'LT-02190',
    //     'country': 'Republic of Lithuania',
    //     'phone': '37052111768',
    //     'vat': '',
    //   },
    //   'ship_from': {
    //     'company': 'Shenzhen LCSC Electronics Technology Co., Ltd',
    //     'attn': 'Xiuyun Zhang',
    //     'street': 'No.110 Hutian Road, Pingdi Town, Longgang District',
    //     'street2': '',
    //     'city': 'SHENZHEN',
    //     'state': '',
    //     'postal_code': '518117',
    //     'country': "China People's Republic",
    //     'phone': '0086-755-83210457',
    //     'vat': '91440300MA5EDMX26A',
    //   },
    //   'products': [
    //     {
    //       'cate_name': 'Capacitors',
    //       'mfr_part': 'SS16',
    //       'customer': 'P3422',
    //       'shipped': 25,
    //       'amount': '2.16',
    //       'unit_value': '0.0864',
    //       'shipping_cost': '3.13',
    //       'total': '5.29',
    //       'origin_country': 'China',
    //     },
    //     {
    //       'cate_name': 'Capacitors',
    //       'mfr_part': '0805W8J0100T5E',
    //       'customer': 'P0923',
    //       'shipped': 100,
    //       'amount': '15.76',
    //       'unit_value': '0.1576',
    //       'shipping_cost': '5.77',
    //       'total': '21.53',
    //       'origin_country': 'China',
    //     },
    //   ],
    // };
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

    // 保存修改
    saveFn() {
      this.loading = true;
      updateCommercialInvoice(this.id, { ...this.detail }).then(({ data }) => {
        this.$message.success('修改成功！');
      }).finally(() => {
        this.loading = false;
      });
    },

    toggleFreight(v) {
      this.detail.freight = v;
      this.totalKey += 1;
    },

    // 计算数组中的某个值之和
    addFn(arr, key) {
      return arr.reduce((pre, cur) => calculator.add(pre, cur[key] || 0).done(), 0);
    },
  },
};
</script>
