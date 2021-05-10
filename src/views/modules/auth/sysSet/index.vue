<template>
  <base-wrapper>
    <div class="sys">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="公司">
          <el-input v-model.trim="params.companyName" placeholder="公司名称、手机"></el-input>
        </el-form-item>
        <el-form-item label="配置项名称">
          <el-input v-model.trim="params.configKey"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查找</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
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
          <el-table-column label="操作" :width="60" type="action" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="space-around" align="middle">
                <a class="font-blue el-icon-edit font-16" @click="edit(scope.row)"></a>
                <a class="font-red el-icon-delete font-16" @click="del(scope.row)"></a>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" align="center"></el-table-column>
          <el-table-column prop="configKey" label="配置项名称" align="center"></el-table-column>
          <el-table-column prop="configValue" label="值" align="center"></el-table-column>
          <el-table-column prop="text" label="说明" align="center"></el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination pt-3"
          :current-page.sync="params.curentPage"
          :page-size="params.pageSize"
          :total="total"
          :page-sizes="[10,20,30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <sys-form
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </sys-form>
  </base-wrapper>
</template>

<script>
import { sysconfigList, delSet } from '@/api/auth/sysSet';
import sysForm from './components/sys-form';

export default {
  name: 'sysSet',
  components: {
    sysForm
  },
  data() {
    return {
      loading: false,
      params: {
        companyName: '',
        configKey: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      selectItems: [],
      dialog: {
        show: false,
        name: '',
        item: {}
      }
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
      sysconfigList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    search() {
      this.params.curentPage = 1;
      this.getList();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    add() {
      this.dialog.item = {};
      this.openDialog();
    },
    edit(row) {
      this.dialog.item = row;
      this.openDialog();
    },
    del(row) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delSet({ ids: row.id })).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    openDialog() {
      this.dialog.show = true;
    },
    closeDialog() {
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
.sys {
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
