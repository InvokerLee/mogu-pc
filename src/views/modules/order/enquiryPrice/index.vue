<template>
  <div class="enquiry-price">
    <el-row type="flex" justify="space-between">
      <el-button type="info" size="mini" icon="el-icon-back" @click="back">返回</el-button>
      <el-button type="primary" size="mini" v-if="showAuditBtn && $hasPermission('auditBackOrder')" @click="audit">{{ $hasPermission('auditBackOrder') }}</el-button>
    </el-row>
    <div class="title font-weight">{{ szlcscNo }} 的询价信息</div>
    <div>
      <el-button type="primary" size="mini" v-if="$hasPermission('adjustValidDate')" @click="delay">{{ $hasPermission('adjustValidDate') }}</el-button>
    </div>
    <el-table
      class="m-t-10"
      border
      size="mini"
      height="120px"
      v-adaptive-height
      :data="tableData"
      @selection-change="(val) => { selectItems = val }"
    >
      <el-table-column width="55" type="selection" align="center"></el-table-column>
      <el-table-column width="55px" type="index" label="No" align="center"></el-table-column>
      <el-table-column label="商品编码" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.number }}</div>
          <div class="font-red" v-if="scope.row.is_audit">(需审核)</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="询价状态" align="center"></el-table-column>
      <el-table-column prop="quantity" label="下单数量" align="center"></el-table-column>
      <el-table-column prop="expired_date" label="报价有效期" align="center"></el-table-column>
      <el-table-column label="采购备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
          <el-button size="mini" type="text" @click="translate(scope.row)">翻译</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="translation_remark" label="展示给客户看的备注翻译" align="center" width="240px"></el-table-column>
      <el-table-column prop="price_origin" label="原价" align="center"></el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.price }}</div>
          <div class="font-red">{{ scope.row.priceUpRate }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="center"></el-table-column>
      <el-table-column label="最小起订量" align="center">
        <template slot-scope="scope">
          <div :class="{'font-red': scope.row.min_quantity > scope.row.quantity}">{{ scope.row.min_quantity }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最大供货数" align="center">
        <template slot-scope="scope">
          <div :class="{'font-red': scope.row.max_provide_number < scope.row.quantity && scope.row.max_provide_number !== -1}">{{ scope.row.max_provide_number }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="delivery_days" label="到货天数" align="center"></el-table-column>
      <el-table-column prop="confirm_purchaser" label="采购确认人" align="center"></el-table-column>
      <el-table-column prop="confirm_date" label="采购确认时间" align="center"></el-table-column>
    </el-table>
    <translate-remark
      v-if="translateRemark.show"
      :visible="translateRemark.show"
      :item="translateRemark.item"
      @success="translateSuccess"
      @cancel="closeTranslateRemark"
    >
    </translate-remark>
    <delay-valid-date
      v-if="delayValidDate.show"
      :visible="delayValidDate.show"
      :item="delayValidDate.item"
      @success="delaySuccess"
      @cancel="closeDelayValidDate"
    >
    </delay-valid-date>
    <audit-dialog
      v-if="auditDialog.show"
      :visible="auditDialog.show"
      :untranslated="auditDialog.untranslated"
      :szlcscNo="szlcscNo"
      @success="auditSuccess"
      @cancel="cloaseAuditDialog"
    >
    </audit-dialog>
  </div>
</template>

<script>
import { inquiryList } from '@/api/order';

import caculator from '@/utils/calculator';

import translateRemark from './components/translate-remark';
import delayValidDate from './components/delay-valid-date';
import auditDialog from './components/audit-dialog';

export default {
  components: {
    translateRemark,
    delayValidDate,
    auditDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      selectItems: [],
      translateRemark: {
        show: false,
        item: {},
      },
      delayValidDate: {
        show: false,
        item: {},
      },
      auditDialog: {
        show: false,
        untranslated: false,
        szlcscNo: '',
      },
      showAuditBtn: true,
    };
  },
  computed: {
    szlcscNo() {
      return this.$route.query.szlcsc_no;
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      if (!this.szlcscNo) return;
      this.loading = true;
      inquiryList(this.szlcscNo)
        .then(({ data }) => {
          this.tableData = data.data.map(v => ({
            ...v,
            priceUpRate: this.getPriceUpRate(v),
          }));
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    getPriceUpRate(product) {
      if (!product.price_origin || !product.price) {
        return '';
      }
      const num = caculator.minus(product.price, product.price_origin)
        .divide(product.price_origin)
        .toFixed(3)
        .done();
      return num > 0 ? `上涨${num * 100}%` : `下降${num * 100}%`;
    },
    back() {
      this.$router.push('/order/bookingOrder');
    },
    translate(row) {
      this.translateRemark.item = row;
      this.translateRemark.show = true;
    },
    translateSuccess() {
      this.closeTranslateRemark();
      this.getDetail();
    },
    closeTranslateRemark() {
      this.translateRemark.show = false;
    },
    delay() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return;
      }
      if (this.selectItems[0].status === '已取消') {
        this.$alert('该物料已被删除，调整报价有效期操作无效。', '异常提醒', {
          confirmButtonText: '确定',
        });
        return;
      }
      this.$confirm('延长报价有效期需先与采购沟通确认，由采购给出具体可延长时间。', '调整报价有效期提示', {
        showCancelButton: false,
        confirmButtonText: '确定',
      }).then(() => {
        this.delayValidDate.item = this.selectItems[0];
        this.delayValidDate.show = true;
      }).catch(() => {});
    },
    delaySuccess() {
      this.getDetail();
      this.closeDelayValidDate();
    },
    closeDelayValidDate() {
      this.delayValidDate.show = false;
    },
    audit() {
      if (this.$route.query.order_status === '已取消') {
        this.$alert('该订单已被取消，将移出待审核列表。', '异常提醒', {
          confirmButtonText: '确定',
        }).then(() => {
          this.showAuditBtn = false;
        });
        return;
      }
      if (this.tableData.some(v => !v.translation_remark)) {
        this.auditDialog.untranslated = true;
      }
      this.auditDialog.show = true;
    },
    auditSuccess() {
      this.showAuditBtn = false;
      this.getDetail();
      this.cloaseAuditDialog();
    },
    cloaseAuditDialog() {
      this.auditDialog.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.enquiry-price {
  width: 100%;
  padding: 20px;
  .title {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
  }
  .w220 {
    width: 220px;;
  }
}
</style>
