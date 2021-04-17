
<template>
  <base-wrapper>
    <div class="stockChangeHistory">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="单据类型">
          <el-select v-model="params.state" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="来往单位">
          <el-input v-model.trim="params.key" placeholder="客户/供应商名称" />
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model.trim="params.key" placeholder="产品名称/规格/条码" />
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
          <el-table-column :min-width="100" prop="username" label="出/入库单号" align="center" />
          <el-table-column prop="username" label="日期" align="center" />
          <el-table-column prop="remarks" label="单据类型" align="center" />
          <el-table-column prop="remarks" label="来往单位" align="center" />
          <el-table-column prop="remarks" label="产品类别" align="center" />
          <el-table-column prop="remarks" label="品牌" align="center" />
          <el-table-column prop="remarks" label="产品" align="center" />
          <el-table-column prop="remarks" label="条码" align="center" />
          <el-table-column prop="remarks" label="批号" align="center" />
          <el-table-column prop="remarks" label="生产日期" align="center" />
          <el-table-column prop="remarks" label="单价" align="center" />
          <el-table-column prop="remarks" label="入库数量" align="center" />
          <el-table-column prop="remarks" label="入库金额" align="center" />
          <el-table-column prop="remarks" label="出库数量" align="center" />
          <el-table-column prop="remarks" label="出库金额" align="center" />
          <el-table-column prop="remarks" label="箱数" align="center" />
          <el-table-column prop="remarks" label="仓库" align="center" />
          <el-table-column prop="remarks" label="单据备注" align="center" />
          <el-table-column prop="remarks" label="上级单号" align="center" />
          <el-table-column prop="remarks" label="审核人" align="center" />
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
  name: 'batchList',
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
.stockChangeHistory {
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
