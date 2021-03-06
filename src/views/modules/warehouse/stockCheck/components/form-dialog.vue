<template>
  <el-dialog
    width="960px"
    :title="isEdit ? '盘点单编辑' : '盘点单新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="stockCheckForm" inline size="mini" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="盘点单号">
        <el-input v-model.trim="form.checkNum" style="width: 200px" placeholder="系统自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="盘点数量" prop="checkCount">
        <el-input v-model="form.checkCount" style="width: 200px;" disabled placeholder="自动计算"></el-input>
      </el-form-item>
      <el-form-item label="盘点日期" prop="checkDate">
        <el-date-picker
          v-model="form.checkDate"
          style="width: 200px"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="仓库" prop="storeId">
        <warehous-selector style="width: 200px" :params="form" paramsKey="storeId" :defaultOpions="warehouseOpts"></warehous-selector>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.text" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="盈亏金额" prop="profitSum">
        <el-input v-model="form.profitSum" style="width: 200px;" disabled placeholder="自动计算"></el-input>
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
      :data="form.listDetail"
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
      <el-table-column :min-width="100" prop="productBarCode" label="条码" align="center" />
      <el-table-column :min-width="120" prop="batchNum" label="批号" align="center" />
      <el-table-column :width="135" prop="productDate" label="生产日期" align="center" />
      <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
      <el-table-column :width="80" prop="oldCount" label="原有数量" align="center" />
      <el-table-column :width="80" prop="currCount" label="现有数量" align="center" />
      <el-table-column :width="80" prop="profirCount" label="盈亏数" align="center" />
      <el-table-column :width="100" prop="oldCost" label="原数量成本额" align="center" />
      <el-table-column :width="100" prop="currCost" label="现数量成本额" align="center" />
      <el-table-column :width="100" prop="profirCost" label="盈亏成本额" align="center" />
    </el-table>

    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
    <add-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      :storeId="form.storeId"
      @success="actionSuccess"
      @cancel="closeDialog"
    ></add-dialog>
  </el-dialog>
</template>

<script>
import WarehousSelector from '@/components/WarehousSelector';
import addDialog from './add-dialog';
import { storecheckInfo, addStoreCheck, editStoreCheck } from '@/api/warehouse';
import dayjs from 'dayjs';

export default {
  components: {
    WarehousSelector,
    addDialog
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        checkCount: '',
        checkDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        storeId: [],
        profitSum: '',
        text: '',
        listDetail: []
      },
      rules: {
        storeId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        profitSum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        checkCount: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        checkDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      dialog: {
        show: false,
        item: {}
      },
      warehouseOpts: []
    };
  },
  created() {
    if (this.item && this.item.id) {
      this.isEdit = true;
      this.getInfo(this.item.id);
    }
  },
  methods: {
    getInfo(id) {
      storecheckInfo(id).then(({ result }) => {
        Object.keys(this.form).forEach((k) => {
          this.form[k] = result[k];
        });
        this.warehouseOpts = [{ name: this.item.storeName, id: this.item.storeId }];
      }).catch(() => {});
    },
    add() {
      if (!this.form.storeId) {
        this.$message.warning('请先选择仓库');
        return;
      }
      this.dialog.item = {};
      this.dialog.show = true;
    },
    edit(item) {
      if (!this.form.storeId) {
        this.$message.warning('请先选择仓库');
        return;
      }
      this.dialog.item = item;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess(item) {
      const existItem = this.form.listDetail.find(v => v.productId === item.productId);
      if (existItem) {
        Object.assign(existItem, item);
      } else {
        this.form.listDetail.push(item);
      }
      this.closeDialog();
      this.calcTotalCount();
    },
    del(i) {
      this.form.listDetail.splice(i, 1);
      this.calcTotalCount();
    },
    calcTotalCount() {
      let c = 0;
      let p = 0;
      this.form.listDetail.forEach((v) => {
        c += v.currCount || 0;
        p += v.profirCost || 0;
      });
      this.form.checkCount = c;
      this.form.profitSum = p;
    },
    confirm() {
      this.$refs.stockCheckForm.validate((valid) => {
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
        ? editStoreCheck({ id: this.item.id, ...this.form })
        : addStoreCheck(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
