<template>
  <base-wrapper v-loading="loading">
    <el-row slot="head" type="flex" justify="space-between">
      <el-button type="info" size="mini" icon="el-icon-back" @click="back">返回</el-button>
      <el-button type="primary" size="mini" @click="submit">生成补发单</el-button>
    </el-row>
    <div class="add-reissue-order">
      <el-form ref="addReissueOrderForm" size="mini" label-width="120px" inline :model="form" :rules="rules">
        <div>
          <div class="title">基本信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="补发单号：">
                <div class="w220 font-gray">系统自动生成</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户编号：">
                <div class="w220">{{ detail.customer_code }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="补发商品金额：">
                <div class="w220">${{ detail.totalMoney }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补发备注：">
                <el-input
                  class="w220"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 3}"
                  v-model.trim="form.supply_remark"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row class="title">
            <span>商品明细</span>
            <div class="m-l-10 fr">
              <el-button size="mini" type="primary" @click="removeItems">清除</el-button>
            </div>
          </el-row>
          <el-table
            border
            size="mini"
            :max-height="400"
            :data="form.supply_products"
            @selection-change="(val) => { selectedItems = val }"
          >
            <el-table-column width="55px" type="selection" align="center"></el-table-column>
            <el-table-column width="55px" type="index" align="center" label="#"></el-table-column>
            <el-table-column prop="product_number" label="商品编号" align="center"></el-table-column>
            <el-table-column label="厂家型号/品牌/客户参考号" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.mpn }}</div>
                <div>{{ scope.row.brand }}</div>
                <div>{{ scope.row.customer_tag }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="originalQuantity" label="应发数量" align="center"></el-table-column>
            <el-table-column label="补发数量" align="center">
              <template slot-scope="scope">
                <el-form-item
                  label-width="0px"
                  label=""
                  :prop="'supply_products.' + scope.$index + '.quantity'"
                  :rules="rules.quantity"
                >
                  <el-input-number
                    class="w100"
                    size="mini"
                    :controls="false"
                    :precision="0"
                    :min="0"
                    :max="scope.row.originalQuantity"
                    v-model="scope.row.quantity"
                    @change="numberChange(scope.row, scope.$index)"
                  >
                  </el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center">
              <template slot-scope="scope">
                <div>${{ scope.row.unit_price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <div>${{ scope.row.money }}</div>
              </template>
            </el-table-column>
            <el-table-column label="重量" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.weight }}g</div>
              </template>
            </el-table-column>
            <el-table-column label="补发类型" align="center">
              <template slot-scope="scope">
                <span>{{ ['', '拆单补发 ', '退货补发'][scope.row.type] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="原单发货状态" align="center">
              <template slot-scope="scope">
                <span>{{ status[scope.row.order_status] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="补发方式" align="center">
              <template slot-scope="scope">
                <span>{{ ['', '国内下单补发 ', '外贸重发'][scope.row.way] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div class="title">物流信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发货方式：" prop="shipment_type" required>
                <el-radio-group class="w220" v-model="form.shipment_type" @change="typeChange">
                  <el-radio :label="2">绑定原单发货</el-radio>
                  <el-radio :label="1">独立发货</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单重量：">
                <div class="w220">{{ detail.totalWeight }}g</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="物流渠道：" prop="express_code">
                <div class="w220">{{ detail.express_name }}</div>
                <el-button type="text" size="mini" v-if="form.shipment_type === 1" @click="changeShippment">选择物流</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计产生运费：">
                <div class="w220">${{ detail.freight }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20" v-if="form.shipment_type === 1">
            <el-col :span="12" v-for="(addr, i) in form.address" :key="addr.type">
              <el-card :header="addr.type === 1 ? '收货地址' : '账单地址'">
                <el-form-item
                  v-for="item in getAddressKeys(addr.type)"
                  label-width="90px"
                  :key="item.prop"
                  :label="item.label"
                  :prop="`address[${i}].${item.prop}`"
                  :required="item.required"
                  :show-message="false"
                >
                  <el-select filterable class="w220" v-if="item.prop === 'country_code'" v-model="addr[item.prop]">
                    <el-option v-for="c in countryCode.itemList" :key="c.code" :label="c.name" :value="c.code"></el-option>
                  </el-select>
                  <el-input class="w220" v-else v-model="addr[item.prop]"></el-input>
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <shippments-selector
      v-if="dialog.visible"
      :visible="dialog.visible"
      :params="dialog.params"
      @cancel="closeDialog"
      @success="selectSuccess"
    >
    </shippments-selector>
  </base-wrapper>
</template>

<script>
import { getOrderCreateInfo, generateOrder } from '@/api/order';

import calculator from '@/utils/calculator';

import shippmentsSelector from './components/shippments-selector';

export default {
  components: {
    shippmentsSelector,
  },
  data() {
    return {
      loading: false,
      detail: {
        customer_code: '',
        totalMoney: '',
        totalWeight: 0,
        original_express_code: '',
        express_name: '',
        freight: 0,
        express_result: [],
      },
      form: {
        supply_remark: '',
        shipment_type: 2,
        express_code: '',
        address: [],
        supply_products: [],
        type: 1, // 默认现货单
      },
      rules: {
        express_code: { required: true, message: '请选择物流渠道', trigger: 'blur' },
        quantity: { required: true, message: '请输入补发数量', trigger: 'blur' },
      },
      selectedItems: [],
      dialog: {
        visible: false,
        params: {},
      },
    };
  },
  computed: {
    status() {
      return this.$store.getters.getConstByGroup('status');
    },
    countryCode() {
      return this.$store.getters.getConstByGroup('country_code');
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      const ids = this.$route.query.ids;
      if (!ids) return;
      const params = {
        supply_pro_ids: ids.split(','),
      };
      this.loading = true;
      getOrderCreateInfo(params).then((res) => {
        this.detail.customer_code = res.data.customer_code;
        this.detail.express_result = res.data.express_result;
        this.detail.original_express_code = res.data.express_code;
        this.form.express_code = res.data.express_code;
        this.form.address = res.data.address;
        this.form.supply_products = res.data.supply_products.map(v => ({
          ...v,
          weight: calculator.times(v.quantity, v.unit_weight).done().toFixed(3),
          originalQuantity: v.quantity,
        }));
        this.getShipInfo(this.form.express_code);
        this.getTotalInfo();
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    getShipInfo(service) {
      if (!service || !this.detail.express_result.length) return;
      const expr = this.detail.express_result.find(v => v.service === service);
      this.detail.freight = expr.cost;
      this.detail.express_name = expr.name;
    },
    back() {
      this.$router.push('/order/reissueProducts');
    },
    submit() {
      this.$refs.addReissueOrderForm.validate((valid) => {
        if (!valid) return;
        const params = {
          type: this.form.type,
          supply_remark: this.form.supply_remark,
          shipment_type: this.form.shipment_type,
          express_code: this.form.express_code,
          supply_products: this.form.supply_products,
        };
        if (this.form.shipment_type === 1) {
          params.address = {
            shipping: {},
            billing: {},
          };
          this.form.address.forEach((addr) => {
            const keys = this.getAddressKeys(addr.type).map(_v => _v.prop);
            keys.forEach((key) => {
              params.address[addr.type === 1 ? 'shipping' : 'billing'][key] = addr[key];
            });
          });
        }
        this.loading = true;
        generateOrder(params).then((res) => {
          this.$message.success('补发单创建成功');
          this.back();
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    numberChange(row, i) {
      this.$refs.addReissueOrderForm.validateField(`supply_products.${i}.quantity`, (err) => {
        if (!err) {
          row.money = calculator.times(row.quantity, row.unit_price).done().toFixed(2);
          row.weight = calculator.times(row.quantity, row.unit_weight).done().toFixed(3);
          this.getTotalInfo();
        }
      });
    },
    removeItems(i) {
      if (!this.selectedItems.length) {
        this.$message.warning('请选择');
        return;
      }
      this.selectedItems.forEach((v) => {
        const itemIndex = this.form.supply_products.findIndex(product => product.id === v.id);
        this.form.supply_products.splice(itemIndex, 1);
      });
      this.getTotalInfo();
    },
    typeChange(val) {
      if (val === 2) {
        this.form.express_code = this.detail.original_express_code;
        this.getShipInfo(this.form.express_code);
      }
    },
    changeShippment() {
      const shipping_addr = this.form.address.find(v => v.type === 1);
      this.dialog.params = {
        products_total: this.detail.totalMoney,
        weight: this.detail.totalWeight,
        items_total: this.form.supply_products.length,
        country: shipping_addr.country_code,
        order_type: shipping_addr.company ? 'company' : 'personal ',
        vat: shipping_addr.vat_code,
        state: shipping_addr.state,
        city: shipping_addr.city,
        post_code: shipping_addr.postcode,
      };
      this.dialog.visible = true;
    },
    selectSuccess(item) {
      this.form.express_code = item.service;
      this.detail.freight = item.cost;
      this.detail.express_name = item.name;
      this.closeDialog();
    },
    closeDialog() {
      this.dialog.visible = false;
    },
    getTotalInfo() {
      let w = 0;
      let m = 0;
      this.form.supply_products.forEach((v) => {
        w = calculator.add(v.weight, w).done();
        m = calculator.add(v.money, m).done();
      });
      this.detail.totalMoney = m;
      this.detail.totalWeight = w;
    },
    getAddressKeys(type) {
      const baseKeys = [
        { label: 'first_name', prop: 'first_name', required: true },
        { label: 'last_name', prop: 'last_name', required: true },
        { label: 'phone', prop: 'phone', required: true },
        { label: 'country', prop: 'country_code', required: true },
        { label: 'state', prop: 'state', required: true },
        { label: 'city', prop: 'city', required: true },
        { label: 'street1', prop: 'street', required: true },
        { label: 'street2', prop: 'street2', required: false },
        { label: 'post code', prop: 'postcode', required: true },
        { label: 'company', prop: 'company', required: false },
      ];
      if (type === 1) {
        baseKeys.push({ label: 'VAT', prop: 'vat_code', required: false });
      }
      return baseKeys;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-reissue-order {
  width: 100%;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin: 5px 0 15px;
    border-bottom: 1px solid #d8dce5;
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
  .w220 {
    width: 220px;;
  }
}
</style>
