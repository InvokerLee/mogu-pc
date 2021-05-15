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
        <el-input style="width: 200px" placeholder="系统自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="盘点日期" prop="orderDate">
        <el-date-picker
          v-model="form.orderDate"
          style="width: 200px"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="仓库" prop="storeId">
        <warehous-selector :params="form" paramsKey="storeId" :defaultOpions="warehouseOpts"></warehous-selector>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model.trim="form.text" style="width: 200px"></el-input>
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
      <el-table-column :width="100" prop="productBarCode" label="条码" align="center" />
      <el-table-column prop="" label="批号" align="center" />
      <el-table-column prop="" label="生产日期" align="center" />
      <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
      <el-table-column :width="80" prop="" label="原有数量" align="center" />
      <el-table-column :width="80" prop="" label="现有数量" align="center" />
      <el-table-column :width="80" prop="" label="盈亏数" align="center" />
      <el-table-column :width="100" prop="" label="原数量成本额" align="center" />
      <el-table-column :width="100" prop="" label="现数量成本额" align="center" />
      <el-table-column :width="100" prop="" label="盈亏成本额" align="center" />
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
import WarehousSelector from '@/components/WarehousSelector';
import addDialog from './add-dialog';
import { specialreserveInfo, addSpecialreserve, editSpecialreserve } from '@/api/config';
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
        orderDate: dayjs().format('YYYY-MM-DD'),
        storeId: [],
        text: '',
        reserveProductList: []
      },
      rules: {
        storeId: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        orderDate: [
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
      specialreserveInfo(id).then(({ result }) => {
        Object.keys(this.form).forEach((k) => {
          this.form[k] = result[k];
        });
        this.warehouseOpts = [{ name: this.item.storeName, id: this.item.storeId }];
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
    },
    del(i) {
      this.form.reserveProductList.splice(i, 1);
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
        ? editSpecialreserve({ id: this.item.id, ...this.form })
        : addSpecialreserve(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
