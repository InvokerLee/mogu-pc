<template>
  <base-wrapper>
    <div class="employee-list">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" hide-details size="mini" inline :model="params">
            <el-form-item label="姓名">
              <el-input v-model.trim="params.staffName" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="params.state" placeholder="请选择" class="w90px">
                <el-option label="全部" value="" />
                <el-option label="有效" :value="1" />
                <el-option label="停用" :value="0" />
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
          <el-button type="primary" size="mini" @click="download">导出</el-button>
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
          <el-table-column :width="60" label="操作" type="action" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="space-around" class="font-16">
                <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
                <a class="font-red el-icon-delete" @click="del(scope.row)"></a>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="phone" label="手机" align="center" />
          <el-table-column label="是否业务员" align="center">
            <template slot-scope="scope">
              <span>{{ ['否', '是'][scope.row.isBizMan] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="text" label="备注" align="center" />
          <el-table-column label="状态" align="center">
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
          :current-page.sync="params.curentPage"
          :page-size="params.pageSize"
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
import { staffInfoList, delStaff } from '@/api/config';
import formDialog from './components/form-dialog';

export default {
  name: 'employeeList',
  components: {
    formDialog
  },
  data() {
    return {
      loading: false,
      params: {
        staffName: '',
        state: '',
        curentPage: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [{}],
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
      staffInfoList(params).then(({ result }) => {
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
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delStaff(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    download() {
      this.$download('/staffinfo/export', { ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.employee-list {
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
