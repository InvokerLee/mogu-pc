<style lang="scss" scoped>
.packingListDetail{
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
  <div v-loading="loading" class="packingListDetail">
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
        PACKING LIST
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td colspan="4" width="50%" style="vertical-align: top;">
            <p style="font-weight: bold;">Ship To：</p>
            <p><editSpan v-model="detail.ship_to.company" /></p>
            <p>ATTN: <editSpan v-model="detail.ship_to.attn" /></p>
            <p><editSpan v-model="detail.ship_to.street" />, <editSpan v-model="detail.ship_to.street2" /></p>
            <p><editSpan v-model="detail.ship_to.city" />, <editSpan v-model="detail.ship_to.state" />, <editSpan v-model="detail.ship_to.postal_code" /></p>
            <p><editSpan v-model="detail.ship_to.country" /></p>
            <p>Phone: <editSpan v-model="detail.ship_to.phone" /></p>
          </td>
          <td colspan="4" width="50%" style="vertical-align: top;">
            <p style="font-weight: bold;">Ship From：</p>
            <p><editSpan v-model="detail.ship_from.company" /></p>
            <p>ATTN: <editSpan v-model="detail.ship_from.attn" /></p>
            <p><editSpan v-model="detail.ship_from.street" /></p>
            <p><editSpan v-model="detail.ship_from.city" /> <editSpan v-model="detail.ship_from.postal_code" /></p>
            <p><editSpan v-model="detail.ship_from.country" /></p>
            <p>Phone: <editSpan v-model="detail.ship_from.phone" /></p>
            <p>VAT: <editSpan v-model="detail.ship_from.vat" /></p>
          </td>
        </tr>
        <tr class="titwrap">
          <td colspan="2">Invoice No.</td>
          <td colspan="3">Date of Shipment</td>
          <td colspan="3">Customer PO No.</td>
        </tr>
        <tr align="center">
          <td colspan="2"><editSpan v-model="detail.invoice_no" /></td>
          <td colspan="3"><editSpan v-model="detail.shipment_date" /></td>
          <td colspan="3"><editSpan v-model="detail.customer_po_no" /></td>
        </tr>
        <tr class="titwrap">
          <td>No.</td>
          <td>LCSC Part #</td>
          <td colspan="3">Full Description of Goods</td>
          <td>Qty. Ordered</td>
          <td>Qty. Shipped</td>
          <td>Net Weight (G)</td>
        </tr>
        <tr align="center" v-for="(v, i) in detail.products" :key="i">
          <td>{{ i + 1 }}</td>
          <td><editSpan v-model="v.lcsc_part" /></td>
          <td colspan="3" align="left">
            <p>Customer #: <editSpan v-model="v.customer" /></p>
            <p>Mfr. Part #: <editSpan v-model="v.mfr_part" /></p>
            <p><editSpan v-model="v.description" /></p>
          </td>
          <td><editSpan v-model="v.ordered" /></td>
          <td><editSpan v-model="v.shipped" /></td>
          <td><editSpan v-model="v.net_weight" /></td>
        </tr>
        <tr align="center">
          <td colspan="5" align="right">Total</td>
          <td>{{ addFn(detail.products, 'ordered') }}</td>
          <td>{{ addFn(detail.products, 'shipped') }}</td>
          <td>{{ addFn(detail.products, 'net_weight') }}</td>
        </tr>
        <tr align="center">
          <td colspan="4">Total Cartons: <editSpan v-model="detail.total_cartons" /></td>
          <td colspan="4">Total Gross Weight: <editSpan v-model="detail.total_gross_weight" /> KG</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getPackingList, updatePackingList } from '@/api/deliveryManagement';
import calculator from '@/utils/calculator';
import print from '@/utils/printJs/print.js';
import editSpan from '@/views/modules/deliveryManagement/components/editSpan.vue';

export default {
  name: 'packingListDetail',
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

      // 计算插件
      calculator,
    };
  },
  created() {
    this.loading = true;
    getPackingList(this.id).then(({ data }) => {
    // const data = {
    //   'invoice_no': '200618QJOU',
    //   'shipment_date': '2020-10-10',
    //   'customer_po_no': '',
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
    //       'lcsc_part': 'ZX2481',
    //       'customer': 'P3422',
    //       'mfr_part': 'SS16',
    //       'description': 'Schottky Barrier Diodes (SBD) SMA(DO-214AC) RoHS',
    //       'ordered': 25,
    //       'shipped': 25,
    //       'net_weight': 1100,
    //     },
    //     {
    //       'lcsc_part': 'ZX25278',
    //       'customer': 'P0923',
    //       'mfr_part': '0805W8J0100T5E',
    //       'description': 'Chip Resistor - Surface Mount 10Ohms ±5% 1/8W 0805 RoHS',
    //       'ordered': 100,
    //       'shipped': 100,
    //       'net_weight': 2960,
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
      updatePackingList(this.id, { ...this.detail }).then(({ data }) => {
        this.$message.success('修改成功！');
      }).finally(() => {
        this.loading = false;
      });
    },

    // 计算数组中的某个值之和
    addFn(arr, key) {
      return arr.reduce((pre, cur) => calculator.add(pre, cur[key] || 0).done(), 0);
    },
  },
};
</script>
