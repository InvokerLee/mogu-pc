<template>
  <el-drawer
    class="permission-info"
    direction="rtl"
    size="360px"
    title="分配权限"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" style="flex-direction: column;height: 100%;">
      <el-tree
        ref="menu"
        v-loading="loading"
        class="tree"
        :data="menuOptions"
        show-checkbox
        node-key="id"
        empty-text="加载中，请稍后"
        :props="{
          children: 'children',
          label:'title'
        }"
      ></el-tree>
      <div class="demo-drawer__footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" :loading="saveLoading" @click="save">保存</el-button>
      </div>
    </el-row>
  </el-drawer>
</template>

<script>
import { getRoleMenus, saveRoleMenus } from '@/api/auth/role';
import { handleTree } from '@/utils';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      saveLoading: false,
      menuOptions: [],

      treeList: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      if (!this.item && this.item.id) return;
      this.loading = true;
      getRoleMenus(this.item.id).then((res) => {
        const arr = res.data;

        this.menuOptions = handleTree(arr, 'id', 'pId');

        // 设置勾选节点
        const checkedKeys = arr.filter(v => v.checked).map(_v => _v.id);
        this.$nextTick(() => {
          checkedKeys.forEach((v) => {
            this.$refs.menu.setChecked(v, true, false);
          });
        });
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    cancel() {
      this.$emit('cancel');
    },
    save() {
      this.saveLoading = true;
      const checkedIds = this.getMenuAllCheckedKeys();
      console.log(checkedIds);
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    }
  }
};
</script>

<style lang="scss">
.permission-info {
  .tree {
    flex: 1;
    margin-bottom: 20px;
    overflow: auto;
  }
  .el-drawer__body {
    padding: 0 15px 15px;
    overflow: auto;
  }
}
</style>
