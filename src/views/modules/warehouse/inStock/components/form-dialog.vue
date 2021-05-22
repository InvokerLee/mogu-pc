<template>
  <el-dialog
    width="960px"
    :title="isEdit ? '入库单编辑' : '入库单新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="specialPriceForm" inline size="mini" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="入库类型" prop="orderType">
        <el-select v-model="form.orderType" placeholder="请选择" style="width: 200px;" :disabled="isEdit">
          <el-option v-for="i in outStockTypes.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入库数量" prop="orderCount">
        <el-input v-model="form.orderCount" style="width: 200px;" disabled placeholder="自动计算"></el-input>
      </el-form-item>
      <el-form-item label="入库日期" prop="orderDate">
        <el-date-picker
          v-model="form.orderDate"
          style="width: 200px"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="入库单号">
        <el-input v-model="form.outOrderNo" style="width: 200px" placeholder="系统自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model.trim="form.text" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="出库仓库">
        <el-input v-model="form.storeName" style="width: 200px" placeholder="禁止输入，自动计算" readonly></el-input>
      </el-form-item>
    </el-form>
    <div style="padding: 3px 0;border-top: 1px solid #ddd;">
      <span>明细</span>
      <el-button style="margin-left: 10px;" type="success" size="mini" @click="add">新增</el-button>
    </div>
    <el-table
      v-loading="loading"
      border
      size="mini"
      :max-height="480"
      :data="form.orderOutStoreProductList"
    >
      <el-table-column type="index" :width="55" label="序号" align="center" />
      <el-table-column :width="60" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" class="font-16">
            <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
            <a class="font-red el-icon-delete" @click="del(scope.$index)"></a>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品" align="center" />
      <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
      <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
      <el-table-column :width="80" prop="count" label="数量" align="center" />
      <el-table-column :width="80" prop="boxCount" label="箱数" align="center" />
      <el-table-column :width="90" prop="storeOutName" label="出库仓库" align="center" />
      <el-table-column :width="90" prop="storeInName" label="入库仓库" align="center" />
      <el-table-column :min-width="120" prop="text" label="备注" align="center" />
    </el-table>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
    <add-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      :orderType="form.orderType"
      @success="actionSuccess"
      @cancel="closeDialog"
    ></add-dialog>
  </el-dialog>
</template>

<script>
import addDialog from './add-dialog';
import dayjs from 'dayjs';
import { outStockInfo, outStockAdd, outStockEdit } from '@/api/warehouse';

export default {
  components: {
    addDialog
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        orderType: '',
        orderCount: '',
        orderDate: dayjs().format('YYYY-MM-DD'),
        outOrderNo: '',
        text: '',
        storeName: '',
        orderOutStoreProductList: []
      },
      rules: {
        orderType: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        orderDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        orderCount: [
          { required: true, message: '请选择明细商品', trigger: 'blur' }
        ]
      },
      dialog: {
        show: false,
        item: {}
      }
    };
  },
  computed: {
    outStockTypes() {
      return this.$store.getters.getConstByKey('outStockType');
    }
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      this.getInfo(this.item.id);
    }
  },
  methods: {
    getInfo(id) {
      outStockInfo(id).then(({ result }) => {
        Object.keys(this.form).forEach((k) => {
          this.form[k] = result[k];
        });
      }).catch(() => {});
    },
    add() {
      this.dialog.item = {};
      this.dialog.show = true;
    },
    edit(item) {
      this.dialog.item = item;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess(item) {
      const existItem = this.form.orderOutStoreProductList.find(v => v.productId === item.productId);
      if (existItem) {
        Object.assign(existItem, item);
      } else {
        this.form.orderOutStoreProductList.push(item);
      }
      this.closeDialog();
      this.calcTotalCount();
    },
    del(i) {
      this.form.orderOutStoreProductList.splice(i, 1);
      this.calcTotalCount();
    },
    calcTotalCount() {
      let c = 0;
      const storeName = [];
      this.form.orderOutStoreProductList.forEach((v) => {
        c += v.count || 0;
        storeName.push(v.storeOutName);
      });
      this.form.orderCount = c;
      this.form.storeName = storeName.join(',');
    },
    confirm() {
      this.$refs.specialPriceForm.validate((valid) => {
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
        ? outStockEdit({ id: this.item.id, ...this.form })
        : outStockAdd(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
