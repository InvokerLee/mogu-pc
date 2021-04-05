<style lang="scss" scoped>
.bluetxt {
  color: #06f;
}
.mt20{
  margin-top: 20px;
}
</style>

<template>
  <el-dialog
    width="480px"
    title="修改物流单号"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="12">
          批次号：<span class="bluetxt">{{ params.batch_no }}</span>
        </el-col>
        <el-col :span="12">
          发货状态：{{ params.status_text }}
        </el-col>
      </el-row>
      <div class="mt20">
        物流渠道：{{ params.express_forwarder_text }}
      </div>
      <div class="mt20">
        <el-form
          ref="form"
          :model="dialog.form"
          :rules="formRules"
          size="mini"
          label-width="98px"
        >
          <el-form-item label="物流单号：" prop="tracking_number">
            <el-input v-model.trim="dialog.form.tracking_number" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="dialog.show = false">
        取消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="dialog.loading"
        @click="submitFn()"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateTrackingNumber } from '@/api/deliveryManagement';

export default {
  name: 'editLogisticsNumDialog',
  data() {
    return {
      // 数据暂存
      params: {},
      // 回调
      cb: null,

      // 弹窗相关
      dialog: {
        show: false,
        loading: false,

        form: {
          tracking_number: '',
        },

      },

      optionList: {
        a: [],
      },

      formRules: {
        tracking_number: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 初始化方法
    show(params, cb) {
      this.params = params;
      this.cb = cb;

      this.dialog.show = true;

      // 以下写此弹窗初始化方法
      // 先清空验证
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });

      // 赋值数据
      this.dialog.form.tracking_number = params.tracking_number;
    },

    // 提交方法
    submitFn() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.dialog.loading = true;
          updateTrackingNumber(this.params.id, {
            tracking_number: this.dialog.form.tracking_number,
          }).then(({ data }) => {
            this.dialog.show = false;
            this.$message.success('修改物流单号成功！');
            this.cb && this.cb();
          }).finally(() => {
            this.dialog.loading = false;
          });
        }
      });
    },
  },
};
</script>
