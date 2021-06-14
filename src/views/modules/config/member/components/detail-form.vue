<template>
  <el-dialog
    width="750px"
    title="兑换新增"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-form ref="itemForm" size="mini" label-width="120px" :model="form" :rules="rules">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="订单号：">
            <el-input v-model.trim="form.orderNo" disabled placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="订单金额：" prop="orderSum">
            <el-input-number
              v-model="form.orderSum"
              size="mini"
              class="w100"
              :controls="false"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="备注：" prop="text">
            <el-input v-model="form.text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单日期：" prop="orderDate">
            <el-date-picker
              v-model="form.orderDate"
              class="w100"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="积分扣减：" prop="vipScore">
            <el-input-number
              v-model="form.vipScore"
              class="w100"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
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
import dayjs from 'dayjs';
import { vipscoreDetailSave } from '@/api/config';

export default {
  props: ['visible', 'vipId'],
  data() {
    return {
      loading: false,
      isEdit: false,
      form: {
        orderNo: '',
        orderSum: undefined,
        text: '',
        orderDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        vipScore: undefined
      },
      rules: {
        orderSum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        text: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        vipScore: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        orderDate: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
  },
  methods: {
    confirm() {
      this.$refs.itemForm.validate((valid) => {
        if (!valid) return;
        const params = {
          vipId: this.vipId,
          ...this.form
        };
        this.loading = true;
        vipscoreDetailSave(params).then(() => {
          this.$message.success('保存成功');
          this.$emit('success');
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
