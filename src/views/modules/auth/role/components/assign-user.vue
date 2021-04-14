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
        label: 'realname',
        key: 'id',
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
import { getUsersByRoleId, saveUsersByRoleId } from '@/api/auth/role';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      originUserKeys: [],
      selectUserKeys: [],
      users: []
    };
  },
  created() {
    this.getRoleUsers();
  },
  methods: {
    getRoleUsers() {
      if (!this.item || !this.item.id) return;
      this.loading = true;
      getUsersByRoleId(this.item.id).then((res) => {
        const { join_user, list } = res.data;
        this.users = join_user.concat(list);
        this.selectUserKeys = join_user.map(v => v.id);
        this.originUserKeys = [...this.selectUserKeys];
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    confirm() {
      const out_user = this.originUserKeys.filter(user_id => !this.selectUserKeys.includes(user_id));
      const in_user = this.selectUserKeys.filter(user_id => !this.originUserKeys.includes(user_id));
      if (!out_user.length && !in_user.length) {
        this.cancel();
        return;
      }
      const params = {
        user_id: in_user.join(','),
        out_user: out_user.join(',')
      };
      this.loading = true;
      saveUsersByRoleId(this.item.id, params).then(() => {
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
