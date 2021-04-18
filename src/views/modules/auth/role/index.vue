<template>
  <base-wrapper>
    <div class="role">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="角色名">
          <el-input v-model.trim="params.roleName"></el-input>
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
          <el-table-column label="操作" :width="200" type="action" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="assignPermission(scope.row)">权限</el-button>
              <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="assignUser(scope.row)">分配用户</el-button>
              <el-button size="mini" type="text" class="font-red" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="名称" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" width="500px" :show-overflow-tooltip="true"></el-table-column>
          <!-- <el-table-column align="center" label="已分配用户">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.user_name"
                class="ellipsis"
                type="text"
                size="mini"
                @click="lookUser(scope.row.user_name)"
              >{{ scope.row.user_name }}</el-button>
            </template>
          </el-table-column> -->
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
    <role-form
      v-if="dialog.show && dialog.name === 'ROLE_FORM'"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </role-form>
    <permission-info
      v-if="dialog.show && dialog.name === 'PERMISSION_INFO'"
      :visible="dialog.show"
      :item="dialog.item"
      @cancel="closeDialog"
    >
    </permission-info>
    <assign-user
      v-if="dialog.show && dialog.name === 'ASSIGN_USER'"
      :visible="dialog.show"
      :item="dialog.item"
      @cancel="closeDialog"
    >
    </assign-user>
  </base-wrapper>
</template>

<script>
import { getRoleList, delRole } from '@/api/auth/role';
import roleForm from './components/role-form';
import permissionInfo from './components/permission-info';
import assignUser from './components/assign-user';

export default {
  name: 'role',
  components: {
    roleForm,
    permissionInfo,
    assignUser
  },
  data() {
    return {
      loading: false,
      params: {
        roleName: '',
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
      getRoleList(params).then(({ result }) => {
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
      this.openDialog('ROLE_FORM');
    },
    edit(row) {
      this.dialog.item = row;
      this.openDialog('ROLE_FORM');
    },
    del(row) {
      this.$confirm('确认要删除选择角色吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delRole(row.roleId)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    assignPermission(item) {
      this.dialog.item = item;
      this.openDialog('PERMISSION_INFO');
    },
    assignUser(item) {
      this.dialog.item = item;
      this.openDialog('ASSIGN_USER');
    },
    lookUser(userStr) {
      this.$msgbox({
        title: '查看已分配用户',
        message: userStr,
        showConfirmButton: false
      }).catch(() => {});
    },
    openDialog(name) {
      this.dialog.name = name;
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
    isSelectSingle() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请单选一项进行操作');
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.role {
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
