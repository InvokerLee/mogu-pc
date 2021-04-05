<template>
  <base-wrapper>
    <div class="permission">
      <div class="left-tree">
        <el-tree
          ref="permissionTree"
          node-key="id"
          :empty-text="emptyText"
          :data="permissionTree"
          :props="{label:'name'}"
          :highlight-current="true"
          :expand-on-click-node="false"
          :default-expanded-keys="[0]"
          @node-click="nodeClick"
        >
        </el-tree>
      </div>
      <div class="right-content">
        <el-form size="mini" :inline="true" ref="ruleForm" :model="params" @submit.native.prevent>
          <el-form-item label="关键字">
            <el-input
              class="keywords"
              placeholder="名称、KEY，多个使用空格隔开"
              v-model.trim="params.key"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="功能等级">
            <el-select placeholder="请选择" v-model="params.auth_level">
              <el-option label="全部" value=""></el-option>
              <el-option label="高" :value="3"></el-option>
              <el-option label="中" :value="2"></el-option>
              <el-option label="低" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="$hasPermission('searchPermission')" @click="search">{{ $hasPermission('searchPermission') }}</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button size="mini" type="success" v-if="$hasPermission('addPermission')" @click="add">{{ $hasPermission('addPermission') }}</el-button>
          <el-button size="mini" type="warning" v-if="$hasPermission('updatePermission')" @click="edit">{{ $hasPermission('updatePermission') }}</el-button>
          <el-button size="mini" type="primary" v-if="$hasPermission('bindResc')" @click="bindResc">{{ $hasPermission('bindResc') }}</el-button>
          <el-button size="mini" type="danger" v-if="$hasPermission('delPermission')" @click="del">{{ $hasPermission('delPermission') }}</el-button>
          <el-button size="mini" type="danger" v-if="$hasPermission('clearPermission')" @click="clear">{{ $hasPermission('clearPermission') }}</el-button>
        </div>
        <el-table
          class="m-t-10"
          border
          size="mini"
          height="120px"
          v-adaptive-height="{bottomOffset: 100}"
          v-loading="tableLoading"
          :data="tableData"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column type="selection" align="center" width="55px"></el-table-column>
          <el-table-column prop="name" align="center" label="功能名称"></el-table-column>
          <el-table-column prop="route" align="center" label="功能KEY"></el-table-column>
          <el-table-column align="center" label="功能等级" width="100">
            <template slot-scope="scope">
              {{ ['', '低', '中', '高'][scope.row.auth_level] }}
            </template>
          </el-table-column>
          <el-table-column prop="parent_name" align="center" label="父级目录" width="100px"></el-table-column>
          <el-table-column prop="sort" align="center" label="排序" width="100px"></el-table-column>
          <el-table-column align="center" label="包含资源">
            <template slot-scope="scope">
              <el-button
                class="ellipsis"
                type="text"
                size="mini"
                v-if="scope.row.resc_name"
                @click="lookText('包含资源' ,scope.row.resc_name)"
              >{{ scope.row.resc_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="功能拥有者">
            <template slot-scope="scope">
              <el-button
                class="ellipsis"
                type="text"
                size="mini"
                v-if="scope.row.user_name"
                @click="lookText('功能拥有者' ,scope.row.user_name)"
              >{{ scope.row.user_name }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, prev, pager, next, jumper"
          v-if="tableData.length"
          class="pagination"
          :current-page.sync="params.page"
          :page-size="params.limit"
          :total="total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <permission-form
      v-if="dialog.show && dialog.name === 'PERMISSION_FORM'"
      :visible="dialog.show"
      :parentListText="permissionForm.parentListText"
      :pid="permissionForm.pid"
      :item="permissionForm.item"
      @success="submitFormSuccess"
      @cancel="closeDialog"
    >
    </permission-form>
    <resource-bind
      v-if="dialog.show && dialog.name === 'RESOURCE_BIND'"
      :visible="dialog.show"
      :item="selectItems[0]"
      @cancel="closeDialog"
    >
    </resource-bind>
  </base-wrapper>
</template>

<script>
import { getPermissionMenus, permissionSearch, delPermission, clearPermissionRole } from '@/api/auth/permission';

import permissionForm from './components/permission-form';
import resourceBind from './components/resource-bind';

export default {
  name: 'permission',
  components: {
    permissionForm,
    resourceBind,
  },
  data() {
    return {
      // 左侧树相关
      permissionTree: [],
      selectNode: {},
      emptyText: '',
      // 右侧
      tableLoading: false,
      params: {
        key: '',
        auth_level: '',
        page: 1,
        limit: 20,
      },
      tableData: [],
      total: 0,
      selectItems: [],
      dialog: {
        show: false,
        name: '',
      },
      permissionForm: {
        parentListText: '',
        pid: '',
        item: {},
      },
    };
  },
  created() {
    this.getTree();
    this.getList();
  },
  methods: {
    getTree() {
      this.emptyText = '正在加载...';
      getPermissionMenus().then((res) => {
        this.permissionTree = [
          {
            name: '立创外贸ERP', // 根节点
            id: 0,
            children: this.formatList(res.data, 0),
          },
        ];
      }).catch(() => {
        this.emptyText = '加载失败，请点击F5重试';
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
    nodeClick(node) {
      this.selectNode = node;
      this.getList();
    },
    insertNodeInTree(node) {
      if (!node) return;
      this.$refs.permissionTree.append(node, { id: node.pid });
    },
    updateNodeFromTree(node) {
      if (!node) return;
      const n = this.$refs.permissionTree.getNode(node.id);
      Object.assign(n.data, node);
    },
    removeNodesFromTree(items) {
      if (!items || !items.length) return;
      items.forEach(v => this.$refs.permissionTree.remove(v));
    },
    // 右侧
    getList() {
      const params = {
        pid: this.selectNode.name ? this.selectNode.id : 0,
      };
      Object.keys(this.params).forEach((k) => {
        if (this.params[k] !== '') {
          params[k] = this.params[k];
        }
      });
      this.tableLoading = true;
      permissionSearch(params).then(({ data }) => {
        this.tableData = data.data;
        this.total = data.total;
      }).catch(() => {}).finally(() => {
        this.tableLoading = false;
      });
    },
    handleCurrentChange() {
      this.getList();
    },
    search() {
      this.params.page = 1;
      this.getList();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
    add() {
      if (!this.selectNode.name) {
        this.$message.warning('请先选择目录层级再新增');
        return;
      }
      this.permissionForm = {
        parentListText: this.getParentListByNode(this.selectNode),
        pid: this.selectNode.id,
        item: {},
      };
      this.openDialog('PERMISSION_FORM');
    },
    edit() {
      if (!this.isSelectSingle()) return;
      const i = this.selectItems[0];
      this.permissionForm = {
        parentListText: this.getParentListByNode({ id: i.pid }),
        pid: i.pid,
        item: i,
      };
      this.openDialog('PERMISSION_FORM');
    },
    del() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择');
        return;
      }
      const params = {
        menu_id: this.selectItems.map(v => v.id).join(','),
      };
      this.$confirm('确认要删除所选功能吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => delPermission(params)).then(() => {
        this.$message.success('删除成功');
        this.getList();
        // 从树中移除该节点
        this.removeNodesFromTree(this.selectItems);
      }).catch(() => {});
    },
    bindResc() {
      if (!this.isSelectSingle()) return;
      this.openDialog('RESOURCE_BIND');
    },
    clear() {
      if (!this.isSelectSingle()) return;
      this.$confirm('清空后，所有角色不再拥有此功能，请谨慎操作。', '确认要清空授权吗?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => clearPermissionRole(this.selectItems[0].id)).then(() => {
        this.$message.success('已清空授权');
        this.getList();
      }).catch(() => {});
    },
    lookText(title, message) {
      this.$msgbox({
        title,
        message,
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
    submitFormSuccess({ node, isEdit }) {
      // 更新树的数据
      if (isEdit) {
        this.updateNodeFromTree(node);
      } else {
        this.insertNodeInTree(node);
      }
      // 右侧数据重新获取
      this.getList();
      this.closeDialog();
    },
    getParentListByNode(node) {
      // 获取 选择节点 层级结构
      let n = this.$refs.permissionTree.getNode(node.id);
      const parentList = [];
      while (n.parent) {
        parentList.unshift(n.data.name);
        n = n.parent;
      }
      return parentList.join(' / ');
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
.permission {
  height: 100%;
  display: flex;
  .left-tree {
    flex: 0 0 auto;
    width: 260px;
    height: 99%;
    overflow-y: auto;
  }
  .right-content {
    flex: 1 1 auto;
    padding-left: 15px;
    .keywords {
      width: 300px;
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
}
</style>
