<template>
  <el-dialog
    class="orderDialog"
    fullscreen
    :title="isEdit ? '订单编辑' : '订单新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="orderForm" size="mini" label-width="100px" inline :model="form" :rules="rules">
      <el-form-item label="单据类型：" prop="orderType">
        <el-select v-model="form.orderType" placeholder="请选择" class="w200px" @change="typeChange">
          <el-option v-for="i in orderTypes.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="showProvider ? '供应商：' : '客户：'"
        :prop="showProvider ? 'provderId' :'guestId'"
      >
        <div class="w200px">
          <customer-selector :params="form" :paramsKey="showProvider ? 'provderId' :'guestId'"></customer-selector>
        </div>
      </el-form-item>
      <el-form-item label="日期：" prop="orderDate">
        <el-date-picker
          v-model="form.orderDate"
          type="month"
          value-format="yyyy-MM"
          class="w200px"
        />
      </el-form-item>
      <el-form-item label="单号：">
        <el-input placeholder="系统自动生成" class="w200px" disabled></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="form.address" placeholder="自动带出客户地址" class="w200px" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model.trim="form.text" class="w200px"></el-input>
      </el-form-item>
      <template v-if="isShoppeSales">
        <el-form-item label="会员：">
          <el-input v-model.trim="form.vipUserId" placeholder="仅专柜销售单显示" class="w200px"></el-input>
        </el-form-item>
        <el-form-item label="积分抵扣：">
          <el-input v-model.trim="form.vipUsedScore" placeholder="仅专柜销售单显示" class="w200px"></el-input>
        </el-form-item>
        <el-form-item label="抵扣金额：">
          <el-input v-model.trim="form.vipFreeSum" placeholder="仅专柜销售单显示" class="w200px"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <el-divider></el-divider>
    <div class="m-t-10 m-b-10">
      <span>明细</span>
      <el-button class="m-l-10" type="success" size="mini">新增</el-button>
    </div>
    <el-table
      border
      size="mini"
      show-summary
      :summary-method="getSummaries"
      :data="orderProductList"
    >
      <el-table-column type="index" label="序号" :width="55" align="center" />
      <el-table-column :width="60" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" class="font-16">
            <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
            <a class="font-red el-icon-delete" @click="del(scope.row)"></a>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品" align="center" />
      <el-table-column :width="80" prop="productBarCode" label="条码" align="center" />
      <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
      <el-table-column :width="60" prop="taxRate" label="税率" align="center" />
      <el-table-column :width="60" prop="count" label="数量" align="center" />
      <el-table-column :width="60" prop="1" label="箱数" align="center" />
      <template v-if="!showLessColumn">
        <el-table-column :width="80" prop="1" label="含税单价" align="center" />
        <el-table-column :width="80" prop="1" label="未税单价" align="center" />
        <el-table-column :width="90" prop="1" label="含税箱单价" align="center" />
        <el-table-column :width="90" prop="1" label="未税箱单价" align="center" />
        <el-table-column :width="90" prop="taxSum" label="含税金额" align="center" />
        <el-table-column :width="90" prop="noTaxSum" label="未税金额" align="center" />
      </template>
      <el-table-column :width="90" prop="1" label="仓库" align="center" />
      <el-table-column prop="text" label="备注" align="center" />
    </el-table>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { addUser, editUser } from '@/api/auth/user';
import CustomerSelector from '@/components/CustomerSelector';
import dayjs from 'dayjs';

const initForm = (params) => {
  return Object.assign({
    guestId: '',
    provderId: '',
    orderDate: dayjs().format('YYYY-MM'),
    address: '',
    text: ''
  }, params);
};

export default {
  components: {
    CustomerSelector
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: initForm({
        orderType: 'sales' // 默认选中
      }),
      orderProductList: [
        { count: 1, taxSum: 2, noTaxSum: 3 },
        { count: 1, taxSum: 2, noTaxSum: 3 }
      ],
      rules: {
        orderType: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        guestId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        provderId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        orderDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    orderTypes() {
      return this.$store.getters.getConstByKey('orderType');
    },
    showLessColumn() {
      return ['shoppeApply', 'sampleApply', 'sampleReturn'].includes(this.form.orderType);
    },
    showProvider() {
      return ['stock', 'stockReturn'].includes(this.form.orderType);
    },
    isShoppeSales() {
      return ['shoppeSales', 'shoppeSalesReturn'].includes(this.form.orderType);
    }
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      Object.keys(this.form).forEach((k) => {
        this.form[k] = this.item[k];
      });
    }
  },
  methods: {
    typeChange() {
      // 重置表单输入
      Object.assign(this.form, initForm());
    },
    confirm() {
      this.$refs.orderForm.validate((valid) => {
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
      // return this.isEdit
      //   ? editUser(this.item.id, this.form)
      //   : addUser(this.form);
    },
    cancel() {
      this.$emit('cancel');
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }

        if (['count', 'taxSum', 'noTaxSum'].includes(column.property)) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        }
      });

      return sums;
    }
  }
};
</script>

<style lang="scss" scoped>
.orderDialog {
  .w200px {
    width: 200px;
  }
  ::v-deep {
    .el-table__footer-wrapper tbody td {
      background-color: yellow;
    }
  }
}
</style>
