<template>
  <base-wrapper>
    <div class="user">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" hide-details size="mini" inline :model="params">
            <el-form-item label="搜索">
              <el-input v-model.trim="params.searchPar" placeholder="公司名称、手机" />
            </el-form-item>
            <el-form-item label="账户类型">
              <el-select v-model="params.accountType" placeholder="请选择" class="w90px">
                <el-option label="全部" value="" />
                <el-option label="基础版" :value="0" />
                <el-option label="企业版" :value="1" />
                <el-option label="旗舰版" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="params.state" placeholder="请选择" class="w90px">
                <el-option label="全部" value="" />
                <el-option label="有效" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
              <span style="margin: 0 20px;">
                <el-divider direction="vertical"></el-divider>
              </span>
              <el-button type="success" size="mini" @click="add">新增</el-button>
            </el-form-item>
          </el-form>
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
          <el-table-column label="操作" :width="120" type="action" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="space-around" align="middle">
                <a class="font-blue el-icon-edit font-16" @click="edit(scope.row)"></a>
                <a class="font-red el-icon-delete font-16" @click="del(scope.row)"></a>
                <a class="font-blue" @click="updatePwd(scope.row)">修改密码</a>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" align="center" />
          <el-table-column prop="phone" :width="110" label="手机" align="center" />
          <el-table-column label="账号类型" :width="80" align="center">
            <template slot-scope="scope">
              <div>
                {{ ['基础班', '企业版', '旗舰版', '高'][scope.row.accountType	] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="validitDate" label="有效期至" :width="100" align="center" />
          <el-table-column label="PC端访问" :width="80" align="center">
            <template slot-scope="scope">
              <div>
                {{ ['是', '否'][scope.row.isPc	] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="APP访问" :width="80" align="center">
            <template slot-scope="scope">
              <div>
                {{ ['是', '否'][scope.row.isApp	] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="wechat" :width="100" label="绑定微信号" align="center" />
          <el-table-column prop="serverNode" label="访问服务器节点" align="center" />
          <el-table-column label="状态" :width="60" align="center">
            <template slot-scope="scope">
              <span>
                {{ ['禁用', '有效'][scope.row.state] }}
              </span>
            </template>
          </el-table-column>
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
    <user-password
      v-if="dialog.show && dialog.name === 'USER_PASSWORD'"
      :visible="dialog.show"
      :item="dialog.item"
      @cancel="closeDialog"
    >
    </user-password>
  </base-wrapper>
</template>

<script>
import { getUserList, delUser } from '@/api/auth/user';
import userInfoForm from './components/user-info-form';
import userPassword from './components/user-password';

export default {
  name: 'user',
  components: {
    userInfoForm,
    userPassword
  },
  data() {
    return {
      loading: false,
      params: {
        searchPar: '',
        accountType: '',
        state: '',
        curentPage: 1,
        pageSize: 10
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
      getUserList(params).then(({ result }) => {
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
      this.openDialog('USER_INFO_FORM');
    },
    edit(item) {
      this.dialog.item = item;
      this.openDialog('USER_INFO_FORM');
    },
    del(item) {
      this.$confirm('确认要删除该用户吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delUser(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    updatePwd(item) {
      this.dialog.item = item;
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
  }
}
</style>
