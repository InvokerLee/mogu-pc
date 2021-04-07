<template>
  <base-wrapper>
    <div class="user">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" size="mini" inline :model="params">
            <el-form-item label="关键词">
              <el-input v-model.trim="params.key" placeholder="请输入账号、名称" />
            </el-form-item>
            <el-form-item label="授权等级">
              <el-select v-model="params.level" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="无" :value="0" />
                <el-option label="低" :value="1" />
                <el-option label="中" :value="2" />
                <el-option label="高" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select v-model="params.status" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button v-if="$hasPermission('searchUser')" type="primary" @click="search">{{ $hasPermission('searchUser') }}</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="tar">
          <el-button v-if="$hasPermission('addUser')" type="success" size="mini" @click="add">{{ $hasPermission('addUser') }}</el-button>
          <el-button v-if="$hasPermission('updateUser')" type="warning" size="mini" @click="edit">{{ $hasPermission('updateUser') }}</el-button>
          <el-button v-if="$hasPermission('updateAuthLevel')" type="primary" size="mini" @click="updateUserLevel">{{ $hasPermission('updateAuthLevel') }}</el-button>
          <el-button v-if="$hasPermission('updatePassword')" type="primary" size="mini" @click="updatePwd">{{ $hasPermission('updatePassword') }}</el-button>
          <el-button v-if="$hasPermission('delUser')" type="danger" size="mini" @click="del">{{ $hasPermission('delUser') }}</el-button>
        </el-col>
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
          <el-table-column prop="username" label="账号" align="center" />
          <el-table-column prop="realname" label="名称" align="center" />
          <el-table-column prop="phone" label="手机" align="center" />
          <el-table-column label="部门" align="center">
            <template slot-scope="scope">
              <span>{{ branchs[scope.row.branch] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="授权等级" align="center">
            <template slot-scope="scope">
              <div>
                {{ ['无', '低', '中', '高'][scope.row.level] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户状态" align="center">
            <template slot-scope="scope">
              <span :class="[scope.row.status === 1 ? 'font-green' : 'font-red']">
                {{ ['', '启用', '禁用'][scope.row.status] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" align="center" width="300px" :show-overflow-tooltip="true" />
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
    <user-info-form
      v-if="dialog.show && dialog.name === 'USER_INFO_FORM'"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
    <user-level
      v-if="dialog.show && dialog.name === 'USER_LEVEL'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
    <user-password
      v-if="dialog.show && dialog.name === 'USER_PASSWORD'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @cancel="closeDialog"
    />
  </base-wrapper>
</template>

<script>
import { getUserList, delUser } from '@/api/auth/user';
import userInfoForm from './components/user-info-form';
import userLevel from './components/user-level';
import userPassword from './components/user-password';

export default {
  name: 'User',
  components: {
    userInfoForm,
    userLevel,
    userPassword
  },
  data() {
    return {
      loading: false,
      params: {
        key: '',
        level: '',
        status: '',
        page: 1,
        limit: 20
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
  computed: {
    branchs() {
      return this.$store.getters.getConstByGroup('branch');
    }
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
      getUserList(params).then(({ data }) => {
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
      this.openDialog('USER_INFO_FORM');
    },
    edit() {
      if (!this.isSelectSingle()) return;
      this.dialog.item = this.selectItems[0];
      this.openDialog('USER_INFO_FORM');
    },
    del() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择');
        return;
      }
      const params = {
        user_id: this.selectItems.map(v => v.id).join(',')
      };
      this.$confirm('确认要删除所选用户吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delUser(params)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    updateUserLevel() {
      if (!this.isSelectSingle()) return;
      this.openDialog('USER_LEVEL');
    },
    updatePwd() {
      if (!this.isSelectSingle()) return;
      this.openDialog('USER_PASSWORD');
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
.user {
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
