<template>
  <div class="scan-sorting" v-loading="loading">
    <div class="scan-input">
      <el-input
        ref="scanInput"
        placeholder="使用扫描枪对国内订单号，分拣柜号，运单号的条形码进行扫描，或手动输入后点击回车"
        v-model="scanText"
        :disabled="weighing"
        @keyup.enter.native="scan"
      >
        <template slot="prepend">请扫描</template>
        <el-button class="reset" slot="append" @click="reset">重置</el-button>
      </el-input>
    </div>
    <div>
      <div class="title">详情信息</div>
      <div class="center">
        <div v-if="detail.type === 'order'">
          <p>{{ detail.code }} 签收成功</p>
          <p class="font-green">
            {{ !detail.storage ? '请继续扫描货柜号' : `货柜号：${detail.storage}` }}
          </p>
          <p class="font-green">
            {{ !detail.is_all_in ? `所属批次${detail.batch_num}未到齐，请继续等待其它包裹` : `所属批次${detail.batch_num}已到齐，请称重！` }}
          </p>
        </div>
        <div v-else-if="detail.type === 'storage'">
          <p>分拣柜扫描成功</p>
          <p class="font-green">请将{{ detail.order }} 放至柜号 {{ detail.storage }}</p>
          <p class="font-green">
            {{ !detail.is_all_in ? `所属批次${detail.batch_num}未到齐，请继续等待其它包裹` : `所属批次${detail.batch_num}已到齐，请称重！` }}
          </p>
        </div>
        <div v-else-if="detail.type === 'express'">
          <p>发货扫描成功</p>
          <p class="font-green">货柜号：{{ detail.storage }}</p>
          <p class="font-green">所属批次：{{ detail.batch_num }}</p>
        </div>
      </div>
    </div>
    <div v-if="detail.is_all_in">
      <div class="title">称重信息</div>
      <div class="load-row">
        <el-button type="primary" size="mini" v-if="!weighing" @click="startWeighing">开始称重</el-button>
        <el-button type="warning" size="mini" v-else @click="endWeighing">结束称重</el-button>
        <div class="bar" v-show="weighing">
          <span class="text">称重中，请将物件放入测量仪器...</span>
        </div>
        <el-button type="primary" size="mini" :disabled="weighing" @click="save">保存</el-button>
      </div>
      <el-form class="p-t-10" ref="weightForm" inline size="mini" :model="form" :disabled="weighing">
        <div class="summary">
          <span>件数：{{ form.weight_array.length }}</span>
          <span class="p-l-10">总重量(kg)：{{ form.total_weight }}</span>
        </div>
        <el-table
          class="m-t-10"
          border
          size="mini"
          :max-height="360"
          :data="form.weight_array"
        >
          <el-table-column label="长(mm)" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weight_array.' + scope.$index + '.length'"
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                  { pattern: /^[1-9]\d*$/, message: '请填写整数', trigger: 'blur' },
                ]"
              >
                <el-input v-model.trim="scope.row.length"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="宽(mm)" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weight_array.' + scope.$index + '.width'"
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                  { pattern: /^[1-9]\d*$/, message: '请填写整数', trigger: 'blur' },
                ]"
              >
                <el-input v-model.trim="scope.row.width"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="高(mm)" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weight_array.' + scope.$index + '.height'"
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                  { pattern: /^[1-9]\d*$/, message: '请填写整数', trigger: 'blur' },
                ]"
              >
                <el-input v-model.trim="scope.row.height"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="称重重量(kg)" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'weight_array.' + scope.$index + '.weight'"
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                  { pattern: /(^[1-9]\d*(\.\d{1,4})?$)|(^0(\.\d{1,4})$)/, message: '整数或保留四位小数', trigger: 'blur' },
                ]"
              >
                <el-input v-model.trim="scope.row.weight" @change="weightChange(scope.row, scope.$index)"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="volume_weight" label="体积重(kg)" align="center"></el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import { scanSubmit, scanReset, scanWeightInfo, updateScanWeight } from '@/api/deliveryManagement/scanSorting.js';
import calculator from '@/utils/calculator';

export default {
  data() {
    return {
      loading: false,
      weighing: false,
      scanText: '',
      detail: {},
      timer: null,
      loopErrorCount: 0,
      form: {
        total_weight: '',
        weight_array: [],
      },
    };
  },
  created() {
    this.$nextTick(() => {
      // 获取扫描输入框焦点
      this.scanInputFocus();
    });
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    reset() {
      scanReset().then(() => {
        this.$message.success('重置成功');
        this.resetData();
      });
    },
    scan(e) {
      if (e.which !== 13 || !this.scanText) return; // 判断是否是按了enter键
      this.resetData();
      const params = {
        code: this.scanText,
      };
      this.loading = true;
      scanSubmit(params)
        .then((res) => {
          this.detail = res.data;
          if (this.detail.is_all_in) {
            this.startWeighing();
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    startWeighing() {
      this.weighing = true;
      this.timer = setInterval(() => {
        this.getWeightInfo();
      }, 3000);
    },
    endWeighing() {
      this.weighing = false;
      this.clearTimer();
      this.calculateTotalSummary();
    },
    getWeightInfo() {
      // 超过5次错误结束称重
      if (this.loopErrorCount >= 5) {
        this.endWeighing();
        return;
      }
      scanWeightInfo().then((res) => {
        if (res.data.code) {
          this.form.weight_array.push(res.data);
        }
      }).catch(() => {
        this.loopErrorCount += 1;
      });
    },
    calculateTotalSummary() {
      let w = 0;
      let vW = 0;
      this.form.weight_array.forEach((v) => {
        w = calculator.add(w, v.weight).done();
        vW = calculator.add(vW, v.volume_weight).done();
      });
      this.form.total_weight = Math.max(w, vW);
    },
    weightChange(row, i) {
      this.$refs.weightForm.validateField(`weight_array.${i}.weight`, (err) => {
        if (!err) {
          this.calculateTotalSummary();
        }
      });
    },
    scanInputFocus() {
      this.$refs.scanInput.focus();
    },
    clearTimer() {
      this.loopErrorCount = 0;
      clearInterval(this.timer);
      this.timer = null;
    },
    resetData() {
      this.clearTimer();
      Object.assign(this.$data, this.$options.data.call(this));
    },
    save() {
      this.$refs.weightForm.validate((valid) => {
        if (!valid) return;
        const params = {
          ...this.form,
          batch_num: this.detail.batch_num,
          parcel_quantity: this.form.weight_array.length,
        };
        this.loading = true;
        updateScanWeight(params).then(() => {
          this.$message.success('保存成功');
          this.resetData();
        }).catch(() => {}).finally(() => {
          this.loading = false;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scan-sorting {
  width: 100%;
  padding: 20px;
  .scan-input {
    width: 750px;
    margin: 0 auto;
  }
  .reset {
    color: #fff;
    background: #1890ff;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin: 5px 0 15px;
    border-bottom: 1px solid #d8dce5;
  }
  .center {
    text-align: center;;
  }
  .summary {
    font-size: 14px;
  }
  .load-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    @keyframes barAnim {
      0% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    .bar {
      flex-grow: 1;
      margin: 0 20px;
      height: 25px;
      line-height: 25px;
      border-radius: 10px;
      background-image: repeating-linear-gradient(45deg,#577399,#577399 50px,#9db4c0 50px,#9db4c0 100px);
      background-size: 600% 100%;
      animation: barAnim 60s linear infinite both;
      .text {
        font-size: 16px;
        font-weight: bold;
        color: #f6fff8;
      }
    }
  }
}
</style>
