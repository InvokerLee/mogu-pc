<template>
  <el-drawer
    class="permission-info"
    direction="rtl"
    size="300px"
    title="已授权功能"
    :visible="visible"
    @close="cancel"
  >
    <el-tree
      v-loading="loading"
      node-key="uuid"
      :data="treeList"
      :props="{label:'name'}"
      :expand-on-click-node="false"
    >
    </el-tree>
  </el-drawer>
</template>

<script>
import { searchRoleAuth } from '@/api/auth/role';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      treeList: [],
    };
  },
  created() {
    this.getFuncTree();
  },
  methods: {
    getFuncTree(uuid) {
      if (!this.item || !this.item.id) return;
      this.loading = true;
      searchRoleAuth(this.item.id).then(({ data }) => {
        this.treeList = this.formatList(data.data, 0);
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    formatList(list, pid) {
      const tree = [];
      list.forEach((item) => {
        if (item.pid === pid && item.status === 1) {
          item.children = this.formatList(list, item.id);
          tree.push(item);
        }
      });
      return tree.sort((a, b) => a.sort - b.sort);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">
.permission-info {
  .el-drawer__body {
    padding: 0 15px 15px;
    overflow: auto;
  }
}
</style>
