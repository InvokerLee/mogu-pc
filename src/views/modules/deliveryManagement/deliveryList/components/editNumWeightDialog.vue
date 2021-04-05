<style lang="scss" scoped>
.bluetxt {
  color: #06f;
}
.mt20{
  margin-top: 20px;
}
.width280{
  width: 280px;
}
.width85{
  width: 85px;
}
.redtxt{
  color: #f00;
}
.oprateicon{
  color: #06f;
  cursor: pointer;
  padding: 2px 5px;
}
</style>

<template>
  <el-dialog
    width="950px"
    title="修改件数称重"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <el-row>
        <el-col :span="6">
          批次号：<span class="bluetxt">{{ params.batch_no }}</span>
        </el-col>
        <el-col :span="6">
          发货状态：{{ params.status_text }}
        </el-col>
      </el-row>
      <div class="mt20">
        <el-form
          ref="form"
          :model="dialog.form"
          :rules="formRules"
          size="mini"
          label-width="108px"
          label-position="left"
        >
          <el-form-item label="件数：" prop="packages">
            <el-input
              v-model.trim="dialog.form.packages"
              disabled
              class="width280"
            />
          </el-form-item>
          <el-form-item label="总重量(kg)：" prop="real_weight">
            <el-input
              v-model.trim="dialog.form.real_weight"
              disabled
              class="width280"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        v-for="(item, idx) in dialog.list"
        :key="idx"
        class="mt20"
      >
        <span class="redtxt">*</span>长(mm)：<el-input
          v-model.trim="item.length"
          class="width85"
          @input="calTotalFn()"
        />&nbsp;
        <span class="redtxt">*</span>宽(mm)：<el-input
          v-model.trim="item.width"
          class="width85"
          @input="calTotalFn()"
        />&nbsp;
        <span class="redtxt">*</span>高(mm)：<el-input
          v-model.trim="item.height"
          class="width85"
          @input="calTotalFn()"
        />&nbsp;
        <span class="redtxt">*</span>称重重量(kg)：<el-input
          v-model.trim="item.weight"
          class="width85"
          @input="calTotalFn()"
        />&nbsp;
        <span class="redtxt">*</span>体积重(kg)：<el-input
          v-model.trim="item.volume_weight"
          class="width85"
          disabled
        />&nbsp;
        <span class="el-icon-plus oprateicon" @click="addFn(idx)"></span>
        <span
          v-if="dialog.list.length > 1"
          class="el-icon-minus oprateicon"
          @click="delFn(idx)"
        ></span>
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="reset()">
        重新获取
      </el-button>
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
import { updateWeight, weightInfo } from '@/api/deliveryManagement';
import calculator from '@/utils/calculator';

export default {
  name: 'editNumWeightDialog',
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
          packages: '',
          real_weight: '',
        },

        list: [],
      },

      formRules: {
        packages: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        real_weight: [
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
      this.reset();
    },

    // 重新获取
    reset() {
      // 重置数据
      this.dialog.form = {
        packages: '',
        real_weight: '',
      };
      this.dialog.list = [];

      this.dialog.loading = true;
      weightInfo(this.params.id).then(({ data }) => {
        this.dialog.form = {
          packages: data.packages,
          real_weight: data.real_weight,
        };

        this.dialog.list = data.packages_info.map((e) =>
          // 只需要指定的字段
          ({
            order_shipment_id: e.order_shipment_id,
            length: e.length,
            width: e.width,
            height: e.height,
            weight: e.weight,
            volume_weight: e.volume_weight,
          }),
        );
      }).finally(() => {
        this.dialog.loading = false;
      });
    },

    // 提交方法
    submitFn() {
      if (this.dialog.list.some((e) => !e.length || !e.width || !e.height || !e.weight || !e.volume_weight)) {
        this.$message.error('请输入完整数据！');
        return;
      }

      this.dialog.loading = true;
      updateWeight(this.params.id, {
        ...this.dialog.form,
        packages_info: this.dialog.list,
      }).then(({ data }) => {
        this.dialog.show = false;
        this.$message.success('修改件数称重成功！');
        this.cb && this.cb();
      }).finally(() => {
        this.dialog.loading = false;
      });
    },

    // 添加
    addFn(idx) {
      this.dialog.list.splice(idx + 1, 0, {
        order_shipment_id: this.params.id,
        length: '',
        width: '',
        height: '',
        weight: '',
        volume_weight: '',
      });

      this.calTotalFn();
    },

    // 删除
    delFn(idx) {
      // 执行删除方法
      const fn = () => {
        this.dialog.list.splice(idx, 1);

        this.calTotalFn();
      };

      // 有数据的弹出确认提示  没数据的直接删除
      const obj = this.dialog.list[idx];
      if (obj.length || obj.width || obj.height || obj.weight || obj.volume_weight) {
        this.$confirm('确认删除这一项数据？', '提示', {
          type: 'warning',
        }).then(() => {
          fn();
        });
      } else {
        fn();
      }
    },

    // 计算件数和总重量
    calTotalFn() {
      // 件数
      this.dialog.form.packages = this.dialog.list.length;

      // 计算每一列的体积重
      this.dialog.list.forEach((e) => {
        if (e.length && e.width && e.height) {
          e.volume_weight = calculator.times(e.length, e.width, e.height).divide(5000, 1000).done();
        } else {
          e.volume_weight = '';
        }
      });

      // 计算每列的称重重量之和 与 每列的体积重之和  哪个大就作为总重量
      const weightTotal = this.dialog.list.reduce((pre, cur) => calculator.add(pre, cur.weight).done(), 0);
      const volumeWeightTotal = this.dialog.list.reduce((pre, cur) => calculator.add(pre, cur.volume_weight).done(), 0);
      this.dialog.form.real_weight = Math.max(weightTotal, volumeWeightTotal);
    },
  },
};
</script>
