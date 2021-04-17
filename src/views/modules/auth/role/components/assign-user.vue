<template>
  <el-dialog
    width="650px"
    title="分配用户"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-transfer
      v-model="selectUserKeys"
      v-loading="loading"
      :titles="['未分配用户', '已分配用户']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      :props="{
        label: 'userAccount',
        key: 'userId',
      }"
      :data="users"
    >
    </el-transfer>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :disabled="loading" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAllUsers, getRoleBindUsers, bindUsersForRole } from '@/api/auth/role';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      users: [],
      originUserKeys: [],
      selectUserKeys: []
    };
  },
  created() {
    this.getUserList();
    this.getRoleUsers();
  },
  methods: {
    getUserList() {
      getAllUsers().then((res) => {
        this.users = res.result;
      }).catch(() => {});
    },
    getRoleUsers() {
      if (!this.item || !this.item.roleId) return;
      this.loading = true;
      getRoleBindUsers({ roleId: this.item.roleId }).then((res) => {
        this.selectUserKeys = res.result;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    confirm() {
      const params = {
        roleId: this.item.roleId,
        userIdList: this.selectUserKeys
      };
      this.loading = true;
      bindUsersForRole(params).then(() => {
        this.$message.success('分配成功');
        this.cancel();
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>
