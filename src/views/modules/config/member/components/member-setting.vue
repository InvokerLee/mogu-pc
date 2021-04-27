<template>
  <el-dialog
    width="720px"
    title="会员设置"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-table
      border
      size="mini"
      :max-height="300"
      :data="tableData"
    >
      <el-table-column prop="level" label="会员级别" width="150px" align="center" />
      <el-table-column prop="label" label="级别名称" align="center" />
      <el-table-column label="级别积分范围" align="center">
        <template slot-scope="scope">
          <div>
            <el-input-number
              v-model="scope.row.min"
              size="mini"
              style="width: 100px;"
              :controls="false"
              :precision="0"
            >
            </el-input-number>
            <span style="margin: 0 15px;">-</span>
            <el-input-number
              v-model="scope.row.max"
              size="mini"
              style="width: 100px;"
              :controls="false"
              :precision="0"
            >
            </el-input-number>

          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 10px 0;">
      积分兑换现金设置
    </div>
    <div style="text-align: center;">
      每
      <el-input-number
        v-model="form.exchangeBase"
        size="mini"
        style="width: 100px;margin: 0 20px;"
        :controls="false"
        :precision="0"
      >
      </el-input-number>
      积分兑换人民币1元
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="confirm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { vipRuleInfo, scoreRuleSave } from '@/api/config';

export default {
  props: ['visible'],
  data() {
    return {
      loading: false,
      form: {
        exchangeBase: ''
      },
      tableData: [
        {
          level: 'LV1',
          label: '普通会员',
          min: undefined,
          max: undefined
        },
        {
          level: 'LV2',
          label: '黄金会员',
          min: undefined,
          max: undefined
        },
        {
          level: 'LV3',
          label: '钻石会员',
          min: undefined,
          max: undefined
        }
      ]
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.loading = true;
      vipRuleInfo().then(({ result }) => {
        this.form.exchangeBase = result.exchangeBase;
        this.tableData[0].min = result.levelOneMin;
        this.tableData[0].max = result.levelOneMax;
        this.tableData[1].min = result.levelTwoMin;
        this.tableData[1].max = result.levelTwoMax;
        this.tableData[2].min = result.levelThrMin;
        this.tableData[2].max = result.levelThrMax;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    confirm() {
      const params = {
        ...this.form,
        'levelOneMin': this.tableData[0].min,
        'levelOneMax': this.tableData[0].max,
        'levelTwoMin': this.tableData[1].min,
        'levelTwoMax': this.tableData[1].max,
        'levelThrMin': this.tableData[2].min,
        'levelThrMax': this.tableData[2].max
      };
      this.loading = true;
      scoreRuleSave(params).then(() => {
        this.$message.success('保存成功');
        this.cancel();
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
