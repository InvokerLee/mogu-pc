<template>
  <base-wrapper>
    <div class="permission">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="菜单名">
          <el-input v-model.trim="params.name"></el-input>
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
      <el-table
        v-loading="tableLoading"
        border
        size="mini"
        row-key="menuId"
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="菜单名"></el-table-column>
        <el-table-column align="center" label="菜单类型" :width="80">
          <template slot-scope="scope">
            {{ ['目录','菜单','按钮'][scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderNum" label="排序" :width="55"></el-table-column>
        <el-table-column align="center" prop="url" label="功能KEY"></el-table-column>
        <el-table-column align="center" prop="perms" label="权限标识"></el-table-column>
        <el-table-column label="操作" align="center" :width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="add(scope.row)"
            >新增</el-button>
            <el-button
              size="mini"
              type="text"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-button
              class="font-red"
              size="mini"
              type="text"
              @click="del(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <permission-form
      v-if="dialog.show && dialog.name === 'PERMISSION_FORM'"
      :visible="dialog.show"
      :item="dialog.item"
      @success="submitFormSuccess"
      @cancel="closeDialog"
    >
    </permission-form>
  </base-wrapper>
</template>

<script>
import { getMenus, delMenus } from '@/api/auth/permission';
import { handleTree } from '@/utils';
import permissionForm from './components/permission-form';

export default {
  name: 'permission',
  components: {
    permissionForm
  },
  data() {
    return {
      // 右侧
      tableLoading: false,
      params: {
        name: ''
      },
      tableData: [],
      dialog: {
        show: false,
        name: '',
        item: {}
      }
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    getMenus() {
      this.tableLoading = true;
      getMenus().then((res) => {
        this.tableData = handleTree(res.result, 'menuId');
        console.log(this.tableData);
      }).catch(() => {}).finally(() => {
        this.tableLoading = false;
      });
    },
    formatList(list, pid) {
      const tree = [];
      list.forEach((item) => {
        if (item.pid === pid) {
          item.children = this.formatList(list, item.id);
          tree.push(item);
        }
      });
      return tree.sort((a, b) => a.sort - b.sort);
    },
    search() {
      this.getMenus();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      this.search();
    },
    add(row) {
      this.openDialog('PERMISSION_FORM');
      this.dialog.item = {
        parentId: row.menuId,
        parentName: row.name
      };
    },
    edit(row) {
      this.openDialog('PERMISSION_FORM');
      this.dialog.item = row;
    },
    del(item) {
      const params = {
        userIds: item.menuId
      };
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delMenus(params)).then(() => {
        this.getMenus();
        this.$message.success('删除成功');
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
    submitFormSuccess() {
      this.closeDialog();
      this.getMenus();
    }
  }
};
</script>

<style lang="scss" scoped>
.permission {
  width: 100%;
}
</style>
