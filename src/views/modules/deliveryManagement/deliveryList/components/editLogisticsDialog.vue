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
    title="修改物流渠道"
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
      <el-row class="mt20">
        <el-col :span="12">
          国家：{{ params.country }}
        </el-col>
        <el-col :span="12">
          预计产生运费：{{ dialog.form.cost }}
        </el-col>
      </el-row>
      <div class="mt20">
        <el-form
          ref="form"
          :model="dialog.form"
          :rules="formRules"
          size="mini"
          label-width="98px"
        >
          <el-form-item label="物流渠道：" prop="code">
            <el-select
              v-model="dialog.form.code"
              filterable
              clearable
              style="width: 100%;"
              @change="codeChangeFn"
            >
              <el-option
                v-for="item in optionList.expressList"
                :key="item.uuid"
                :label="item.name_cn"
                :value="item.uuid"
              />
            </el-select>
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
import { getExpressChannel, updateExpressChannel } from '@/api/deliveryManagement';

export default {
  name: 'editLogisticsDialog',
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
          code: '',
          cost: '',
        },

      },

      optionList: {
        expressList: [],
      },

      formRules: {
        code: [
          { required: true, message: '请选择', trigger: 'change' },
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
      // 清空表单数据
      this.dialog.form = {
        code: '',
        cost: '',
      };

      // 获取物流渠道列表
      this.optionList.expressList = [];
      this.dialog.loading = true;
      getExpressChannel(this.params.id).then(({ data }) => {
        this.optionList.expressList = data;
      }).finally(() => {
        this.dialog.loading = false;
      });
    },

    // 提交方法
    submitFn() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.dialog.loading = true;
          updateExpressChannel(this.params.id, this.dialog.form).then(({ data }) => {
            this.dialog.show = false;
            this.$message.success('修改物流渠道成功！');
            this.cb && this.cb();
          }).finally(() => {
            this.dialog.loading = false;
          });
        }
      });
    },

    // 物流渠道改变时
    codeChangeFn(v) {
      this.dialog.form.cost = this.optionList.expressList.find((e) => e.uuid === v).cost;
    },
  },
};
</script>
