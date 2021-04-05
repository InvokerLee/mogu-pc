<template>
  <div class="reissue-goods" v-loading="loading">
    <el-row type="flex" justify="space-between">
      <el-button type="info" size="mini" icon="el-icon-back" @click="back">返回</el-button>
      <el-button type="primary" size="mini" @click="submit">提交退货</el-button>
    </el-row>
    <el-form ref="cancelDeliverForm" size="mini" label-width="140px" :inline="true" :model="form" :rules="rules">
      <div>
        <div class="title">基本信息</div>
        <el-form-item label="订单编号：">
          <div class="w220">{{ form.order_no }}</div>
        </el-form-item>
        <el-form-item label="客户编号：">
          <div class="w220">{{ form.customer_code }}</div>
        </el-form-item>
        <el-form-item label="处理方式：" prop="handle_way">
          <el-radio-group class="w220" v-model="form.handle_way">
            <el-radio v-for="item in backgoodWay.itemList" :key="item.code" :label="item.code">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退货原因：" prop="reason">
          <el-select class="w220" v-model="form.reason">
            <el-option v-for="item in backgoodReason.itemList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理备注：">
          <el-input
            class="w220"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 3}"
            v-model.trim="form.handle_remark"
          >
          </el-input>
        </el-form-item>
      </div>
      <div v-if="form.handle_way === 1">
        <div class="title">补发信息</div>
        <el-form-item label="补发方式：">
          <el-radio-group class="w220" v-model="form.handle_way">
            <el-radio label="1">国内下单补发</el-radio>
            <el-radio label="2">外贸补发</el-radio>
            <!-- <el-radio v-for="item in backgoodWay.itemList" :key="item.code" :label="item.code">{{item.name}}</el-radio> -->
          </el-radio-group>
          <div class="font-12 font-red">
            <div>1. 国内下单补发，生成补发单时会向国内推送订单，走国内取货出库流程。</div>
            <div>2. 外贸重发，生成补发单时不推送国内，指有实物退回到外贸发货部，可直接发货</div>
          </div>
        </el-form-item>
      </div>
      <div v-else-if="form.handle_way === 2">
        <div class="title">退款信息</div>
        <el-form-item label="退款方式：">
          <el-select class="w220" v-model="form.bb">
            <el-option label="1" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计商品退款金额：">
          <div class="w220">***********</div>
        </el-form-item>
        <el-form-item label="运费退款">
          <el-input class="w220"></el-input>
        </el-form-item>
        <el-form-item label="手续费退款">
          <el-input class="w220"></el-input>
        </el-form-item>
        <el-form-item label="收取取货费">
          <el-input class="w220"></el-input>
        </el-form-item>
        <el-form-item label="收取其他费用">
          <el-input class="w220"></el-input>
        </el-form-item>
        <el-form-item label="预计退款总金额：">
          <div class="w220">***********</div>
        </el-form-item>
      </div>
      <el-row type="flex" class="title">
        <span>请勾选需要退货商品明细</span>
        <div class="m-l-10">
          <el-button size="mini" type="primary" @click="selectProduct">选择商品</el-button>
        </div>
      </el-row>
      <el-table
        border
        size="mini"
        height="120px"
        v-adaptive-height
        :data="form.products"
      >
        <el-table-column width="55px" type="index" align="center"></el-table-column>
        <el-table-column label="商品编号" align="center"></el-table-column>
        <el-table-column label="厂家型号/封装" align="center"></el-table-column>
        <el-table-column label="发货数量" align="center"></el-table-column>
        <el-table-column label="已退货数量" align="center"></el-table-column>
        <el-table-column label="退货数量" align="center" width="150px">
          <template slot-scope="scope">
            <el-input-number
              class="w100"
              size="mini"
              :min="1"
              :max="scope.row.num"
              :controls="false"
              v-model="scope.row.cancelNum"
            >
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="需要入库数量" align="center" width="150px">
        </el-table-column>
        <el-table-column label="无需入库数量" align="center" width="150px">
        </el-table-column>
        <el-table-column label="单价" align="center"></el-table-column>
        <el-table-column label="金额" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <template slot-scope="scope">
            <el-button class="font-red" type="text" size="mini" @click="removeItems(scope.$index)">移除明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-dialog
      title="请选择订单 ***** 要退货补发的商品"
      width="480px"
      v-if="dialogShow"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
    >
      <el-table
        border
        size="mini"
        :max-height="400"
        :data="allProducts"
        @selection-change="(val) => { selectedItems = val }"
      >
        <el-table-column width="55" type="selection" align="center"></el-table-column>
        <el-table-column label="商品编号" align="center"></el-table-column>
        <el-table-column label="下单数量" align="center"></el-table-column>
        <el-table-column label="实发数量" align="center"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="selectFinish">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { backgoodApplayInitData } from '@/api/order';

export default {
  data() {
    return {
      loading: false,
      form: {
        order_no: '',
        customer_code: '',
        handle_way: '',
        reason: '',
        handle_remark: '',
        aaa: 2,
        products: [],
      },
      rules: {
        handle_way: [
          { required: true, message: '请选择处理方式', trigger: 'blur' },
        ],
        reason: [
          { required: true, message: '请选择退货原因', trigger: 'blur' },
        ],
      },
      selectedItems: [],
      allProducts: [{ id: 1, num: 1000 }, { id: 2, num: 500 }],
      dialogShow: false,
    };
  },
  computed: {
    backgoodWay() {
      return this.$store.getters.getConstByGroup('backgood_way');
    },
    backgoodReason() {
      return this.$store.getters.getConstByGroup('backgood_reason');
    },
  },
  created() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      const { orderId } = this.$route.query;
      if (orderId) {
        this.loading = true;
        backgoodApplayInitData(orderId)
          .then((res) => {
            this.form = res.data;
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      }
    },
    back() {
      this.$router.push({
        path: '/order/orderList',
      });
    },
    submit() {
    },
    selectProduct() {
      this.selectedItems = [];
      this.dialogShow = true;
    },
    selectFinish() {
      this.selectedItems.forEach((v) => {
        const product = this.form.products.find(item => item.id === v.id);
        if (!product) {
          this.form.products.push({
            ...v,
            cancelNum: v.num,
          });
        }
      });
      this.cancel();
    },
    removeItems(i) {
      this.form.products.splice(i, 1);
    },
    cancel() {
      this.dialogShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.reissue-goods {
  width: 100%;
  padding: 20px;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin: 5px 0 15px;
    border-bottom: 1px solid #d8dce5;
  }
  .w220 {
    width: 220px;
  }
}
</style>
