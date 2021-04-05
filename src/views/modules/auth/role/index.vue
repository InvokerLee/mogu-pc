<template>
  <base-wrapper>
    <div class="role">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" size="mini" inline :model="params">
            <el-form-item label="关键词">
              <el-input v-model.trim="params.key"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-if="$hasPermission('searchRole')" @click="search">{{ $hasPermission('searchRole') }}</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="tar">
          <el-button type="success" size="mini" v-if="$hasPermission('addRole')" @click="add">{{ $hasPermission('addRole') }}</el-button>
          <el-button type="warning" size="mini" v-if="$hasPermission('updateRole')" @click="edit">{{ $hasPermission('updateRole') }}</el-button>
          <el-button type="primary" size="mini" v-if="$hasPermission('assignUser')" @click="assignUser">{{ $hasPermission('assignUser') }}</el-button>
          <el-button type="primary" size="mini" v-if="$hasPermission('assignPermission')" @click="assignPermission">{{ $hasPermission('assignPermission') }}</el-button>
          <el-button type="primary" size="mini" v-if="$hasPermission('permissionInfo')" @click="watchPermissionInfo">{{ $hasPermission('permissionInfo') }}</el-button>
          <el-button type="danger" size="mini" v-if="$hasPermission('delRole')" @click="del">{{ $hasPermission('delRole') }}</el-button>
        </el-col>
      </el-row>
      <div>
        <el-table
          border
          size="mini"
          height="120px"
          v-adaptive-height="{bottomOffset: 100}"
          v-loading="loading"
          :data="tableData"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column width="55" type="selection" align="center"></el-table-column>
          <el-table-column prop="name" label="名称" align="center"></el-table-column>
          <el-table-column prop="remark" label="描述" align="center" width="300px" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="已分配用户">
            <template slot-scope="scope">
              <el-button
                class="ellipsis"
                type="text"
                size="mini"
                v-if="scope.row.user_name"
                @click="lookUser(scope.row.user_name)"
              >{{ scope.row.user_name }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          v-if="tableData.length"
          class="pagination"
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
    <role-form
      v-if="dialog.show && dialog.name === 'ROLE_FORM'"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </role-form>
    <assign-user
      v-if="dialog.show && dialog.name === 'ASSIGN_USER'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </assign-user>
    <permission-info
      v-if="dialog.show && dialog.name === 'PERMISSION_INFO'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @cancel="closeDialog"
    >
    </permission-info>
  </base-wrapper>
</template>

<script>
import { getRoleList, delRole } from '@/api/auth/role';
import roleForm from './components/role-form';
import assignUser from './components/assign-user';
import permissionInfo from './components/permission-info';

export default {
  name: 'role',
  components: {
    roleForm,
    assignUser,
    permissionInfo,
  },
  data() {
    return {
      loading: false,
      params: {
        key: '',
        page: 1,
        limit: 20,
      },
      total: 0,
      tableData: [],
      selectItems: [],
      dialog: {
        show: false,
        name: '',
        item: {},
      },
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
      getRoleList(params).then(({ data }) => {
        this.tableData = data.data;
        this.total = data.total;
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
    add() {
      this.dialog.item = {};
      this.openDialog('ROLE_FORM');
    },
    edit() {
      if (!this.isSelectSingle()) return;
      this.dialog.item = this.selectItems[0];
      this.openDialog('ROLE_FORM');
    },
    del() {
      if (!this.isSelectSingle()) return;
      const { id } = this.selectItems[0];
      this.$confirm('确认要删除选择角色吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => delRole(id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    assignUser() {
      if (!this.isSelectSingle()) return;
      this.openDialog('ASSIGN_USER');
    },
    assignPermission() {
      if (!this.isSelectSingle()) return;
      this.$router.push(`/auth/assign-permission?roleId=${this.selectItems[0].id}`);
    },
    watchPermissionInfo() {
      if (!this.isSelectSingle()) return;
      this.openDialog('PERMISSION_INFO');
    },
    lookUser(userStr) {
      this.$msgbox({
        title: '查看已分配用户',
        message: userStr,
        showConfirmButton: false,
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
    },
  },
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
    margin: 20px 0;
  }
}
</style>
