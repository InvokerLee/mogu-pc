
<template>
  <base-wrapper>
    <div class="orderGrossProfit">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="客户">
          <el-input v-model.trim="params.key" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model.trim="params.key" placeholder="名称/规格/条码" />
        </el-form-item>
        <el-form-item label="毛利率低于">
          <el-input v-model.trim="params.key" placeholder="" class="w60px" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="params.created_at"
            style="width: 250px;"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 40}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column width="55" type="index" label="序号" align="center" />
          <el-table-column prop="username" label="订单日期" align="center" />
          <el-table-column prop="username" label="订单号" align="center" />
          <el-table-column prop="username" label="客户" align="center" />
          <el-table-column prop="username" label="产品" align="center" />
          <el-table-column prop="remarks" label="订购数量" align="center" />
          <el-table-column prop="remarks" label="订购单价" align="center" />
          <el-table-column prop="remarks" label="订购金额" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="发货出库数量" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="发货出库金额" align="center" />
          <el-table-column prop="remarks" label="损耗数量" align="center" />
          <el-table-column prop="remarks" label="销售金额" align="center" />
          <el-table-column prop="remarks" label="成本金额" align="center" />
          <el-table-column prop="remarks" label="毛利额" align="center" />
          <el-table-column prop="remarks" label="毛利率" align="center" />
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination py-3"
          :current-page.sync="params.page"
          :page-size="params.limit"
          :total="total"
          :page-sizes="[10,20,30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </base-wrapper>
</template>

<script>
// import { getUserList } from '@/api/auth/user';

export default {
  name: 'orderGrossProfit',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        key: '',
        level: '',
        status: '',
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: []
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      // getUserList(params).then(({ data }) => {
      //   this.tableData = data.data;
      //   this.total = data.total;
      // }).catch(() => {}).finally(() => {
      //   this.loading = false;
      // });
    },
    search() {
      this.params.page = 1;
      // this.getList();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      // this.getList();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.orderGrossProfit {
  width: 100%;
  .tar {
    width: auto;
    flex: 0 0 auto;
  }
  .pagination {
    text-align: center;
  }
}
</style>
