<template>
  <base-wrapper v-loading="loading">
    <el-row slot="head" type="flex" justify="space-between">
      <el-button type="info" size="mini" icon="el-icon-back" @click="back">返回</el-button>
      <el-input v-model.trim="searchText" class="func-search" size="mini" placeholder="请输入功能名称" @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="mini" @click="search">查找</el-button>
      <el-button style="margin-left: auto;" type="primary" size="mini" @click="beforeSave">保存</el-button>
    </el-row>
    <div class="assign-permission">
      <el-tree
        ref="tree"
        node-key="id"
        show-checkbox
        :data="treeList"
        :props="{label:'name'}"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="checkedKeys"
      >
        <span slot-scope="{ node, data }">
          <span :class="{ 'isSearched': data.isSearched }" style="font-size: 14px;">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <before-assign
      v-if="beforeAssign.show"
      :visible="beforeAssign.show"
      :addItems="beforeAssign.addItems"
      :delItems="beforeAssign.delItems"
      @confirm="save"
      @cancel="close"
    >
    </before-assign>
  </base-wrapper>
</template>

<script>
import { searchRoleAuth, setRoleAuth } from '@/api/auth/role';

import beforeAssign from './components/before-assign';

export default {
  components: {
    beforeAssign
  },
  data() {
    return {
      loading: false,
      searchText: '',
      treeList: [],
      checkedKeys: [],
      expandedKeys: [],
      currentNodeKey: '',
      orignalPermissions: [],
      beforeAssign: {
        show: false,
        addItems: [],
        delItems: []
      }
    };
  },
  created() {
    this.getFuncTree(this.$route.query.roleId);
  },
  methods: {
    getFuncTree(roleId) {
      if (!roleId) return;
      this.loading = true;
      searchRoleAuth(roleId).then(({ data }) => {
        this.treeList = this.formatList(data.data, { id: 0 });
        this.$nextTick(() => {
          this.orignalPermissions = this.$refs.tree.getCheckedNodes(false, true);
        });
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    formatList(list, parent) {
      const tree = [];
      list.forEach((item) => {
        if (item.pid === parent.id) {
          item.parentListText = parent.id === 0 ? item.name : `${parent.parentListText}-${item.name}`;
          item.children = this.formatList(list, item);
          if (item.status === 1 && item.children.every(_v => _v.status === 1)) {
            this.checkedKeys.push(item.id);
          } else {
            item.status = 0;
          }
          tree.push(item);
        }
      });
      return tree.sort((a, b) => a.sort - b.sort);
    },
    back() {
      this.$router.push('/auth/role');
    },
    search() {
      this.treeList = this.queryNameFromTree(this.searchText, this.treeList);
    },
    queryNameFromTree(keywords, arr) {
      return arr.map((v) => {
        v.isSearched = keywords && v.name.indexOf(keywords) !== -1;
        if (v.children && v.children.length !== 0) {
          v.children = this.queryNameFromTree(keywords, v.children);
          if (v.children.some(_v => _v.isSearched) && this.expandedKeys.indexOf(v.id) === -1) {
            this.expandedKeys.push(v.id);
          }
        }
        return v;
      });
    },
    beforeSave() {
      if (!this.$route.query.roleId) {
        this.$message.warning('角色ID不存在，无法保存');
        return;
      }
      const checkPermissions = this.$refs.tree.getCheckedNodes(false, true);
      this.beforeAssign.delItems = this.orignalPermissions.filter(v => !checkPermissions.some(_v => _v.id === v.id));
      this.beforeAssign.addItems = checkPermissions.filter(v => !this.orignalPermissions.some(_v => _v.id === v.id));
      if (!this.beforeAssign.delItems.length && !this.beforeAssign.addItems.length) {
        this.$message.warning('授权功能没有任何变动，请重新操作');
        return;
      }
      this.beforeAssign.show = true;
    },
    save(menu_ids) {
      this.close();
      const checkPermissions = this.$refs.tree.getCheckedNodes(false, true);
      const params = {
        menu_id: checkPermissions.map(v => v.id).join(',')
      };
      this.loading = true;
      setRoleAuth(this.$route.query.roleId, params).then(() => {
        this.$message.success({
          showClose: true,
          message: '分配成功'
        });
        this.back();
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    close() {
      this.beforeAssign.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.func-search {
  width: 150px;
  margin: 0 15px;
}
.assign-permission {
  width: 100%;
  .isSearched {
    color: #fff;
    background-color: #409EFF;
    padding: 2px;
  }
}
</style>
<style lang="scss">
.assign-permission {
  .el-tree {
    display: flex;
    flex-wrap: wrap;
    &>.el-tree-node {
      width: 25%;
      padding: 5px 0;
      border-bottom: 2px solid #dfe4ed;
    }
  }
}
</style>
