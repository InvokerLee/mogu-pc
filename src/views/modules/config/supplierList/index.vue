<template>
  <base-wrapper>
    <div class="supplier-list">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" hide-details size="mini" inline :model="params">
            <el-form-item label="供应商名称">
              <el-input v-model.trim="params.key" placeholder="输入供应商名称/助记符查询" />
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
        </el-col>
        <el-col class="tar">
          <el-button type="success" size="mini" @click="add">新增</el-button>
          <el-button type="primary" size="mini">导出</el-button>
        </el-col>
      </el-row>
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 40}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
        >
          <el-table-column label="操作" type="action" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="名称" align="center" />
          <el-table-column prop="realname" label="助记符" align="center" />
          <el-table-column prop="realname" label="单价含税" align="center" />
          <el-table-column prop="realname" label="账期" align="center" />
          <el-table-column prop="realname" label="地址" align="center" />
          <el-table-column prop="realname" label="电话" align="center" />
          <el-table-column prop="remarks" label="联系人" align="center" />
          <el-table-column prop="remarks" label="付款方式" align="center" />
          <el-table-column prop="remarks" label="备注" align="center" />
          <el-table-column :width="60" label="状态" align="center">
            <template slot-scope="scope">
              <span>
                {{ ['停用', '有效'][scope.row.state] }}
              </span>
            </template>
          </el-table-column>
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
import formDialog from './components/form-dialog';

export default {
  name: 'supplierList',
  components: {
    formDialog
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
.supplier-list {
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
