<template>
  <el-card shadow="never" class="main-list">
    <div slot="header">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item>
          <el-tag type="info">会员信息</el-tag>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model.trim="params.phoneNumber" placeholder="会员手机" />
        </el-form-item>
        <el-form-item label="会员级别">
          <el-select v-model="params.vipLevel" placeholder="请选择" class="w120px">
            <el-option label="全部" value="" />
            <el-option label="普通会员" :value="0" />
            <el-option label="黄金会员" :value="1" />
            <el-option label="钻石会员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="success" size="mini" @click="add">新增</el-button>
          <el-button type="primary" size="mini" @click="memeberSettingShow = true">会员设置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      border
      size="mini"
      :max-height="600"
      :data="tableData"
      highlight-current-row
      @current-change="rowChange"
    >
      <el-table-column :width="60" label="操作" type="action" align="center">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" class="font-16">
            <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
            <!-- <a class="font-red el-icon-delete" @click="del(scope.row)"></a> -->
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :width="100" prop="phone" label="手机号" align="center" />
      <el-table-column :width="90" prop="createDate" label="注册日期" align="center" />
      <el-table-column :width="90" prop="birthday" label="生日" align="center" />
      <el-table-column prop="score" label="积分" align="center" />
      <el-table-column :width="100" label="会员级别" align="center">
        <template slot-scope="scope">
          <span>
            {{ ['普通会员', '黄金会员', '钻石会员'][scope.row.vipLevel] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="text" label="备注" align="center" />
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
      :current-page.sync="params.curentPage"
      :page-size="params.pageSize"
      :total="total"
      :page-sizes="[10,20,30]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <form-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
    <member-setting
      v-if="memeberSettingShow"
      :visible="memeberSettingShow"
      @cancel="memeberSettingShow = false"
    ></member-setting>
  </el-card>
</template>

<script>
import formDialog from './form-dialog';
import memberSetting from './member-setting';
import { vipuserList } from '@/api/config';

export default {
  components: {
    formDialog,
    memberSetting
  },
  data() {
    return {
      loading: false,
      params: {
        phoneNumber: '',
        vipLevel: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [{ id: 1 }],
      dialog: {
        show: false,
        item: {}
      },
      memeberSettingShow: false
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
      vipuserList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).finally(() => {
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
    rowChange(row) {
      this.$emit('rowClickChange', row);
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.main-list {
  width: 100%;
  .pagination {
    text-align: center;
  }
  ::v-deep {
    .el-card__header, .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
