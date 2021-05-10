<template>
  <base-wrapper>
    <div class="apply-list">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="搜索">
          <el-input v-model.trim="params.companyName" placeholder="公司名称、手机"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="待处理" :value="0" />
            <el-option label="通过" :value="1" />
            <el-option label="驳回" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查找</el-button>
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
        >
          <el-table-column label="操作" :width="100" type="action" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="space-around" align="middle">
                <a class="font-blue" @click="pass(scope.row)">通过</a>
                <a class="font-red" @click="noPass(scope.row)">驳回</a>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :min-width="150" prop="companyName" label="公司名称" align="center"></el-table-column>
          <el-table-column :width="60" prop="contactName" label="联系人" align="center"></el-table-column>
          <el-table-column :width="100" prop="phone" label="手机" align="center"></el-table-column>
          <el-table-column :min-width="140" prop="agentBrand" label="代理品牌" align="center"></el-table-column>
          <el-table-column prop="salesChannel" label="销售渠道" align="center"></el-table-column>
          <el-table-column :width="80" label="是否生产" align="center">
            <template slot-scope="scope">
              {{ scope.row.isProduce?'是': '否' }}
            </template>
          </el-table-column>
          <el-table-column :width="100" label="是否启用批号" align="center">
            <template slot-scope="scope">
              {{ scope.row.isUsedBatch?'是': '否' }}
            </template>
          </el-table-column>
          <el-table-column :width="135" prop="applyDate" label="申请日期" align="center"></el-table-column>
          <el-table-column :min-width="120" prop="applyText" label="备注" align="center"></el-table-column>
          <el-table-column prop="state" label="状态" align="center">
            <template slot-scope="scope">
              {{ ['待审核', '通过', '驳回'][scope.row.state] }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination pt-3"
          :current-page.sync="params.page"
          :page-size="params.limit"
          :total="total"
          :page-sizes="[10,20,30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </base-wrapper>
</template>

<script>
import { getApplyList, auditPass, reject } from '@/api/auth/applyList';

export default {
  name: 'applyList',
  data() {
    return {
      loading: false,
      params: {
        companyName: '',
        state: '',
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: []
    };
  },
  created() {
    this.getList();
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
      getApplyList(params).then(({ page }) => {
        this.tableData = page.dataList;
        this.total = page.totalCount;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    search() {
      this.params.page = 1;
      this.getList();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    pass(row) {
      auditPass(row.id).then(() => {
        this.$message.success('已通过');
        this.getList();
      }).catch(() => {});
    },
    noPass(row) {
      reject(row.id).then(() => {
        this.$message.success('已驳回');
        this.getList();
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-list {
  width: 100%;
  .tar {
    width: auto;
    flex: 0 0 auto;
  }
  .ellipsis {
    white-space: nowrap;
    width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  .pagination {
    text-align: center;
  }
}
</style>
