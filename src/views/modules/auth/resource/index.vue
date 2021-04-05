<template>
  <base-wrapper>
    <div class="resource">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form ref="searchForm" size="mini" inline :model="params">
            <el-form-item label="关键词">
              <el-input v-model.trim="params.key"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-if="$hasPermission('searchResc')" @click="search">{{ $hasPermission('searchResc') }}</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="tar">
          <el-button type="success" size="mini" v-if="$hasPermission('addResc')" @click="add">{{ $hasPermission('addResc') }}</el-button>
          <el-button type="warning" size="mini" v-if="$hasPermission('updateResc')" @click="edit">{{ $hasPermission('updateResc') }}</el-button>
          <el-button type="danger" size="mini" v-if="$hasPermission('delResc')" @click="del">{{ $hasPermission('delResc') }}</el-button>
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
          <el-table-column prop="resc_name" label="名称" align="center"></el-table-column>
          <el-table-column prop="url" label="URL" align="center"></el-table-column>
          <el-table-column prop="methods" label="类型" align="center"></el-table-column>
          <el-table-column prop="remark" label="描述" align="center" width="480px" :show-overflow-tooltip="true"></el-table-column>
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
    <resource-form
      v-if="dialog.show && dialog.name === 'RESOURCE_FORM'"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    >
    </resource-form>
  </base-wrapper>
</template>

<script>
import { getResources, delResc } from '@/api/auth/resc';
import resourceForm from './components/resource-form';

export default {
  name: 'resource',
  components: {
    resourceForm,
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
      getResources(params).then(({ data }) => {
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
      this.openDialog('RESOURCE_FORM');
    },
    edit() {
      if (!this.isSelectSingle()) return;
      this.dialog.item = this.selectItems[0];
      this.openDialog('RESOURCE_FORM');
    },
    del() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择');
        return;
      }
      const params = {
        resc_id: this.selectItems.map(v => v.id).join(','),
      };
      this.$confirm('确认要删除所选资源吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => delResc(params)).then(() => {
        this.$message.success('删除成功');
        this.getList();
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
.resource {
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
