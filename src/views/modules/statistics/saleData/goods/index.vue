
<template>
  <base-wrapper>
    <div class="goods">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="产品">
          <el-input v-model.trim="params.key" placeholder="名称/规格/条码" />
        </el-form-item>
        <el-form-item label="类别">
          <category-search :param="params" paramsKey="key"></category-search>
        </el-form-item>
        <el-form-item label="品牌">
          <brand-search :param="params" paramsKey="brand">></brand-search>
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
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="primary" size="mini">导出</el-button>
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
        >
          <el-table-column :width="55" label="序号" type="index" align="center" />
          <el-table-column prop="username" label="产品类别" align="center" />
          <el-table-column prop="remarks" label="品牌" align="center" />
          <el-table-column prop="remarks" label="产品" align="center" />
          <el-table-column prop="remarks" label="条码" align="center" />
          <el-table-column prop="remarks" label="订购数量" align="center" />
          <el-table-column prop="remarks" label="订购箱数" align="center" />
          <el-table-column prop="remarks" label="订购金额" align="center" />
          <el-table-column prop="remarks" label="出库数量" align="center" />
          <el-table-column prop="remarks" label="出库箱数" align="center" />
          <el-table-column prop="remarks" label="出库金额" align="center" />
          <el-table-column prop="remarks" label="出库成本" align="center" />
          <el-table-column prop="remarks" label="回单数量" align="center" />
          <el-table-column prop="remarks" label="回单箱数" align="center" />
          <el-table-column prop="remarks" label="回单金额" align="center" />
          <el-table-column prop="remarks" label="回单成本" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收退货数量" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收退货箱数" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收退货金额" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收退货成本" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收损耗数量" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收损耗箱数" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收损耗金额" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="验收损耗成本" align="center" />
          <el-table-column :min-width="120" prop="remarks" label="验收退货入库数量" align="center" />
          <el-table-column :min-width="120" prop="remarks" label="验收退货入库箱数" align="center" />
          <el-table-column :min-width="120" prop="remarks" label="验收退货入库金额" align="center" />
          <el-table-column :min-width="120" prop="remarks" label="验收退货入库成本" align="center" />
          <el-table-column :min-width="150" prop="remarks" label="验收退货入库报损数量" align="center" />
          <el-table-column :min-width="150" prop="remarks" label="验收退货入库报损箱数" align="center" />
          <el-table-column :min-width="150" prop="remarks" label="验收退货入库报损金额" align="center" />
          <el-table-column :min-width="150" prop="remarks" label="验收退货入库报损成本" align="center" />
          <el-table-column prop="remarks" label="退货数量" align="center" />
          <el-table-column prop="remarks" label="退货箱数" align="center" />
          <el-table-column prop="remarks" label="退货金额" align="center" />
          <el-table-column prop="remarks" label="退货成本" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货入库数量" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货入库箱数" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货入库金额" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货入库成本" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货报损数量" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货报损箱数" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货报损金额" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="退货报损成本" align="center" />
          <el-table-column prop="remarks" label="销售数量" align="center" />
          <el-table-column prop="remarks" label="销售箱数" align="center" />
          <el-table-column prop="remarks" label="销售金额" align="center" />
          <el-table-column :min-width="100" prop="remarks" label="产品成本金额" align="center" />
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
import CategorySearch from '@/components/CategorySearch';
import BrandSearch from '@/components/BrandSearch';
// import { getUserList } from '@/api/auth/user';

export default {
  name: 'goods',
  components: {
    CategorySearch,
    BrandSearch
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
.goods {
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
