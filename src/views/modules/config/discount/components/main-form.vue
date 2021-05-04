<template>
  <el-dialog
    width="640px"
    :title="isEdit ? '促销编辑' : '促销新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="contractForm" size="mini" label-width="120px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="客户：" prop="guestId">
            <customer-selector :params="form" paramsKey="guestId" :defaultOpions="guestOptions" :multiple="true"></customer-selector>
          </el-form-item>
          <el-form-item label="条码：" required>
            <el-input v-model.trim="form.productBarCode" placeholder="自动带出" disabled></el-input>
          </el-form-item>
          <el-form-item label="档期：">
            <el-input v-model.trim="form.auctionCalendar"></el-input>
          </el-form-item>
          <el-form-item label="开始时间：" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              class="w100"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="原供价(含税)：" required>
            <el-input v-model.trim="form.oldTaxPrice" placeholder="自动带出" disabled></el-input>
          </el-form-item>
          <el-form-item label="原供价(未税)：">
            <el-input v-model.trim="form.oldNoTaxPrice" placeholder="自动计算" disabled></el-input>
          </el-form-item>
          <el-form-item label="赠品基数：">
            <el-input-number
              v-model="form.giftCount"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品：" prop="productId">
            <product-selector :params="form" paramsKey="productId" :defaultOpions="productOptions" @selectChange="selectChange"></product-selector>
          </el-form-item>
          <el-form-item label="变价属性：" prop="priceType">
            <el-select v-model="form.priceType" placeholder="请选择" class="w100">
              <el-option label="邮报变价" :value="0" />
              <el-option label="店庆变价" :value="1" />
              <el-option label="DM变价" :value="2" />
              <el-option label="市场调变" :value="3" />
              <el-option label="其他" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="限量">
            <el-input-number
              v-model="form.limitCount"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              class="w100"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="现供价(含税)：" prop="newTaxPrice">
            <el-input-number
              v-model="form.newTaxPrice"
              class="w100"
              :controls="false"
              :precision="2"
              @change="calcPrice"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="现供价(未税)：">
            <el-input v-model.trim="form.newNoTaxPrice" placeholder="自动计算" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model.trim="form.text"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addPromotion, editPromotion } from '@/api/config';
import CustomerSelector from '@/components/CustomerSelector';
import ProductSelector from '@/components/ProductSelector';
import BigNumber from 'bignumber.js';

export default {
  components: {
    CustomerSelector,
    ProductSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        guestId: [],
        productBarCode: '',
        auctionCalendar: '',
        startDate: '',
        oldTaxPrice: '',
        oldNoTaxPrice: '',
        giftCount: undefined,
        productId: '',
        priceType: '',
        limitCount: undefined,
        endDate: '',
        newTaxPrice: undefined,
        newNoTaxPrice: '',
        text: '',
        salesTaxRate: '' // 用于计算
      },
      rules: {
        guestId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        priceType: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        newTaxPrice: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      productOptions: [],
      guestOptions: []
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
      // 默认给一个筛选框
      this.productOptions = [{ name: this.item.productName, productId: this.item.productId }];
      this.guestOptions = this.item.guestName.split(';').map((val, index) => ({
        guestName: val,
        guestId: this.item.guestId[index]
      }));
    }
  },
  methods: {
    selectChange(products) {
      this.form.productBarCode = products[0].barCode;
      this.form.oldTaxPrice = products[0].salsePrice;
      this.form.oldNoTaxPrice = products[0].salseNoTaxPrice;
      // 处理现供价
      this.form.newTaxPrice = '';
      this.form.salesTaxRate = products[0].salesTaxRate;
    },
    calcPrice(val) {
      if (!this.form.salesTaxRate) return;
      const a = new BigNumber(val).times(this.form.salesTaxRate).dividedBy(100);
      this.form.newNoTaxPrice = new BigNumber(val).minus(a).toFixed(2);
    },
    confirm() {
      this.$refs.contractForm.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.saveForm().then(() => {
          this.$message.success('保存成功');
          this.$emit('success');
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    saveForm() {
      return this.isEdit
        ? editPromotion({ id: this.item.id, ...this.form })
        : addPromotion(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
