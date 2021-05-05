<template>
  <el-dialog
    width="960px"
    :title="isEdit ? '出库单编辑' : '出库单新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="specialPriceForm" inline size="mini" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="出库类型" prop="orderType">
        <el-select v-model="form.orderType" placeholder="请选择" style="width: 200px;">
          <el-option v-for="i in outStockTypes.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出库数量" prop="reserveCount">
        <el-input v-model="form.reserveCount" style="width: 200px;" disabled placeholder="自动计算"></el-input>
      </el-form-item>
      <el-form-item label="出库日期" prop="startDate">
        <el-date-picker
          v-model="form.startDate"
          style="width: 200px"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="出库单号">
        <el-input style="width: 200px" placeholder="系统自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model.trim="form.text" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="出库仓库">
        <el-input style="width: 200px" placeholder="禁止输入，自动计算" readonly></el-input>
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
      :data="form.reserveProductList"
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
      <el-table-column :width="80" prop="count" label="箱数" align="center" />
      <el-table-column :width="90" prop="storeName" label="出库仓库" align="center" />
      <el-table-column :width="90" prop="storeName" label="入库仓库" align="center" />
      <el-table-column prop="text" label="备注" align="center" />
    </el-table>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
    <add-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    ></add-dialog>
  </el-dialog>
</template>

<script>
import addDialog from './add-dialog';
import { specialreserveInfo, addSpecialreserve, editSpecialreserve } from '@/api/config';

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
        startDate: '',
        endDate: '',
        text: '',
        reserveCount: undefined,
        reserveProductList: []
      },
      rules: {
        orderType: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        reserveCount: [
          { required: true, message: '必填', trigger: 'blur' }
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
      specialreserveInfo(id).then(({ result }) => {
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
      const existItem = this.form.reserveProductList.find(v => v.productId === item.productId);
      if (existItem) {
        Object.assign(existItem, item);
      } else {
        this.form.reserveProductList.push(item);
      }
      this.closeDialog();
      this.calcTotalCount();
    },
    del(i) {
      this.form.reserveProductList.splice(i, 1);
      this.calcTotalCount();
    },
    calcTotalCount() {
      let c = 0;
      this.form.reserveProductList.forEach((v) => {
        c += v.count || 0;
      });
      this.form.reserveCount = c;
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
        ? editSpecialreserve({ id: this.item.id, ...this.form })
        : addSpecialreserve(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
