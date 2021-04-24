<template>
  <div v-if="rowId">
    <el-card shadow="never" class="branch-list">
      <div slot="header">
        <el-form ref="searchForm" hide-details size="mini" inline :model="params">
          <el-form-item label="">
            <el-tag type="info">门店信息</el-tag>
          </el-form-item>
          <el-form-item label="门店名称">
            <el-input v-model.trim="params.guestName" placeholder="输入门店名称/助记符" />
          </el-form-item>
          <el-form-item label="业务员">
            <staff-selector :params="params" paramsKey="bizManId"></staff-selector>
          </el-form-item>
          <el-form-item label="客户类型">
            <el-select v-model="params.clientType" placeholder="请选择" class="w120px">
              <el-option label="全部" value="" />
              <el-option label="正常客户" :value="0" />
              <el-option label="专柜客户" :value="1" />
              <el-option label="代配送客户" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="params.state" placeholder="请选择" class="w120px">
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
            <el-button type="primary" size="mini" @click="download">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        border
        size="mini"
        :max-height="600"
        :data="tableData"
      >
        <el-table-column label="操作" type="action" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="门店名称" align="center" />
        <el-table-column prop="parentName" label="上级客户" align="center" />
        <el-table-column :width="80" prop="shortKey" label="助记符" align="center" />
        <el-table-column :width="70" prop="bizManName" label="业务员" align="center" />
        <el-table-column :width="70" prop="isCheck" label="是否结账" align="center">
          <template slot-scope="scope">
            {{ ['否', '是'][scope.row.isCheck] }}
          </template>
        </el-table-column>
        <el-table-column :width="70" prop="isTax" label="单价含税" align="center">
          <template slot-scope="scope">
            {{ ['否', '是'][scope.row.isTax] }}
          </template>
        </el-table-column>
        <el-table-column :width="90" prop="clientType" label="客户类型" align="center">
          <template slot-scope="scope">
            {{ ['正常客户', '专柜客户', '代配送客户'][scope.row.clientType] }}
          </template>
        </el-table-column>
        <el-table-column :width="60" prop="paymentDays" label="账期" align="center" />
        <el-table-column prop="address" label="地址" align="center" />
        <el-table-column :width="100" prop="phone" label="电话" align="center" />
        <el-table-column :width="70" prop="contactMan" label="联系人" align="center" />
        <el-table-column :width="70" prop="payType" label="付款方式" align="center">
          <template slot-scope="scope">
            {{ ['到付', '预付', '月结'][scope.row.payType] }}
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
        :current-page.sync="params.page"
        :page-size="params.limit"
        :total="total"
        :page-sizes="[10,20,30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <hq-add
        v-if="dialog.show"
        :visible="dialog.show"
        :item="dialog.item"
        :isDetail="true"
        @success="actionSuccess"
        @cancel="closeDialog"
      />
    </el-card>
  </div>
</template>

<script>
import StaffSelector from '@/components/StaffSelector';
import hqAdd from './hq-add';

import { guestInfoDetailList } from '@/api/config';
export default {
  components: {
    StaffSelector,
    hqAdd
  },
  props: ['rowId'],
  data() {
    return {
      loading: false,
      params: {
        guestName: '',
        clientType: '',
        bizManId: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialog: {
        show: false,
        item: {}
      }
    };
  },
  watch: {
    rowId(val) {
      if (!val) {
        Object.assign(this.params, this.$options.data.call(this).params);
        return;
      }
      this.getList();
    }
  },
  methods: {
    getList() {
      const params = {
        parentId: this.rowId
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      guestInfoDetailList(params).then(({ result }) => {
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
    handleSizeChange(val) {
      this.params.limit = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    download() {
      this.$download('/guestinfo/export', { parentId: this.rowId, ...this.params });
    }
  }
};
</script>

<style lang="scss" scoped>
.branch-list {
  width: 100%;
  margin-top: 3px;
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
