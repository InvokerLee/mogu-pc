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
        <div>
          <el-button size="mini" type="success" @click="add">新增</el-button>
          <el-button size="mini" type="warning" @click="edit">编辑</el-button>
          <el-button size="mini" type="danger" @click="del">删除</el-button>
        </div>
        <el-table
          v-adaptive-height="{bottomOffset: 100}"
          v-loading="tableLoading"
          class="m-t-10"
          border
          size="mini"
          height="120px"
          :data="tableData"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column type="selection" align="center" width="55px"></el-table-column>
          <el-table-column prop="name" align="center" label="功能名称"></el-table-column>
          <el-table-column prop="route" align="center" label="功能KEY"></el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, prev, pager, next, jumper"
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
import { getMenus, permissionSearch, delPermission } from '@/api/auth/permission';

import permissionForm from './components/permission-form';
import resourceBind from './components/resource-bind';

export default {
  name: 'permission',
  components: {
    permissionForm,
    resourceBind
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
        limit: 10
      },
      tableData: [],
      total: 0,
      selectItems: [],
      dialog: {
        show: false,
        name: ''
      },
      permissionForm: {
        parentListText: '',
        pid: '',
        item: {}
      }
    };
  },
  created() {
    this.getTree();
    // this.getList();
  },
  methods: {
    getTree() {
      this.emptyText = '正在加载...';
      getMenus().then((res) => {
        console.log(res);
        // this.permissionTree = [
        //   {
        //     name: '立创外贸ERP', // 根节点
        //     id: 0,
        //     children: this.formatList(res.data, 0)
        //   }
        // ];
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
        pid: this.selectNode.name ? this.selectNode.id : 0
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
        item: {}
      };
      this.openDialog('PERMISSION_FORM');
    },
    edit() {
      if (!this.isSelectSingle()) return;
      const i = this.selectItems[0];
      this.permissionForm = {
        parentListText: this.getParentListByNode({ id: i.pid }),
        pid: i.pid,
        item: i
      };
      this.openDialog('PERMISSION_FORM');
    },
    del() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择');
        return;
      }
      const params = {
        menu_id: this.selectItems.map(v => v.id).join(',')
      };
      this.$confirm('确认要删除所选功能吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
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
    }
  }
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
