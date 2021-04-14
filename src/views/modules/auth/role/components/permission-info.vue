<template>
  <el-drawer
    class="permission-info"
    direction="rtl"
    size="360px"
    title="分配权限"
    :visible="visible"
    @close="cancel"
  >
    <el-tree
      ref="menu"
      v-loading="loading"
      :data="menuOptions"
      show-checkbox
      node-key="id"
      empty-text="加载中，请稍后"
      :props="{
        children: 'children',
        label:'title'
      }"
    ></el-tree>
  </el-drawer>
</template>

<script>
import { searchRoleAuth } from '@/api/auth/role';
import { handleTree } from '@/utils';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      menuOptions: [],

      treeList: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      setTimeout(() => {
        // const data = require('./per.json');
        const data = require('./per2.json');
        this.menuOptions = handleTree(data, 'id', 'pId');
        const checkedKeys = data.filter(v => v.checked).map(_v => _v.id);
        checkedKeys.forEach((v) => {
          this.$nextTick(() => {
            this.$refs.menu.setChecked(v, true, false);
          });
        });
        this.loading = false;
      }, 2000);
    },
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
    }
  }
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
