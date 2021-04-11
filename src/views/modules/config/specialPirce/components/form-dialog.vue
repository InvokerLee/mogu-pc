<template>
  <el-dialog
    width="960px"
    :title="isEdit ? '特价编辑' : '特价新增'"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="specialPriceForm" inline size="mini" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="预留单号">
        <el-input style="width: 200px" placeholder="系统自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="客户">
        <customer-selector style="width: 200px" :params="form" paramsKey="customerId" :multiple="true"></customer-selector>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="form.date"
          class="w100"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="预留数量">
        <el-input style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="form.date"
          class="w100"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
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
      :data="tableData"
    >
      <el-table-column type="index" :width="55" label="序号" align="center" />
      <el-table-column label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button size="danger" type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="预留单号" align="center" />
      <el-table-column prop="remarks" label="规格" align="center" />
      <el-table-column prop="remarks" label="条码" align="center" />
      <el-table-column prop="remarks" label="单位" align="center" />
      <el-table-column prop="remarks" label="预留数量" align="center" />
      <el-table-column prop="remarks" label="预留仓库" align="center" />
      <el-table-column prop="remarks" label="备注" align="center" />
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
import CustomerSelector from '@/components/CustomerSelector';
import addDialog from './add-dialog';
// import { addUser, editUser } from '@/api/auth/user';

export default {
  components: {
    CustomerSelector,
    addDialog
  },
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        realname: '',
        phone: '',
        status: 1,
        remarks: ''
      },
      tableData: [],
      rules: {
        realname: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      },
      dialog: {
        show: false,
        item: {}
      }
    };
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
    actionSuccess() {
      this.getList();
      this.closeDialog();
    },
    del(row) {

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
      // return this.isEdit
      //   ? editUser(this.item.id, this.form)
      //   : addUser(this.form);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
