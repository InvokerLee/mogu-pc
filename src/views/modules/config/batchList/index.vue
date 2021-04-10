
<template>
  <base-wrapper>
    <div class="batch-list">
      <el-form ref="searchForm" size="mini" inline :model="params">
        <el-form-item label="供应商">
          <el-input v-model.trim="params.key" placeholder="请输入公司名" />
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model.trim="params.key" placeholder="产品名称/规格/条码" />
        </el-form-item>
        <el-form-item label="批号">
          <el-input v-model.trim="params.key" placeholder="批号" />
        </el-form-item>
        <el-form-item label="生产日期">
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
        <el-form-item label="状态">
          <el-select v-model="params.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row class="m-b-10">
        <el-button type="success" size="mini" @click="add">新增</el-button>
        <el-button type="primary" size="mini">导出</el-button>
        <el-button type="primary" size="mini">批量设置无效</el-button>
      </el-row>
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 100}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column width="55" type="selection" align="center" />
          <el-table-column label="操作" type="action" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="供应商名称" align="center" />
          <el-table-column prop="remarks" label="产品" align="center" />
          <el-table-column prop="remarks" label="批号" align="center" />
          <el-table-column prop="remarks" label="生产日期" align="center" />
          <el-table-column prop="remarks" label="保质期" align="center" />
          <el-table-column prop="remarks" label="有效期至" align="center" />
          <el-table-column prop="remarks" label="建档日期" align="center" />
          <el-table-column prop="remarks" label="备注" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>
                {{ ['', '启用', '禁用'][scope.row.status] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
          :current-page.sync="params.page"
          :page-size="params.limit"
          :total="total"
          :page-sizes="[10,20,30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <form-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </base-wrapper>
</template>

<script>
// import { getUserList } from '@/api/auth/user';

export default {
  name: 'brandList',
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
      tableData: [],
      selectItems: {},
      dialog: {
        show: false,
        name: '',
        item: {}
      }
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
    },
    add() {
      this.dialog.item = {};
      this.dialog.show = true;
    },
    edit(item) {
      this.dialog.item = item;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
.batch-list {
  width: 100%;
  .tar {
    width: auto;
    flex: 0 0 auto;
  }
  .pagination {
    text-align: center;
    margin: 20px 0;
  }
}
</style>
