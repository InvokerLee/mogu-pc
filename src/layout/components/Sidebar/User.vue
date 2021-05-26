<template>
  <el-row type="flex" class="user">
    <div class="name">
      <!-- <el-tooltip effect="dark" content="账户设置" placement="bottom"> -->
      <span>{{ realname || '李四' }}</span>
      <!-- </el-tooltip> -->
    </div>
    <!-- <div class="icon">
      <el-badge :value="50">
        <el-popover
          placement="right-end"
          title=""
          width="200"
          trigger="click"
        >
          <el-row class="user-popover">
            <div class="title">订单提示</div>
            <div class="line"></div>
            <el-row type="flex" justify="space-between">
              <span class="item">待付款订单</span>
              <span class="font-red">10</span>
            </el-row>
            <div class="line"></div>
            <el-row type="flex" justify="space-between">
              <span class="item">待发货订单</span>
              <span class="font-red">10</span>
            </el-row>
            <div class="line"></div>
            <el-row type="flex" justify="space-between">
              <span class="item">已发货订单</span>
              <span class="font-red">10</span>
            </el-row>
            <div class="line"></div>
            <el-row type="flex" justify="space-between">
              <span class="item">已完成订单</span>
              <span class="font-red">10</span>
            </el-row>
            <div class="line"></div>
            <div class="title" style="margin-top: 20px;">广告提示</div>
            <div class="line"></div>
            <el-row type="flex" justify="space-between">
              <span class="item">广告位即将到期</span>
              <span class="font-red">10</span>
            </el-row>
          </el-row>
          <i slot="reference" style="color: #fff" class="el-icon-bell"></i>
        </el-popover>
      </el-badge>

    </div> -->
    <div class="icon">
      <el-tooltip effect="dark" content="退出登录" placement="bottom">
        <i class="el-icon-switch-button font-red" @click="logout"></i>
      </el-tooltip>
    </div>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'realname'
    ])
  },
  methods: {
    async logout() {
      const loading = this.$loading({ lock: true });
      await this.$store.dispatch('user/logout');
      loading.close();
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.name {
  display: inline-block;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  line-height: 50px;
  font-size: 13px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon {
  width: 20px;
  font-size: 18px;
  margin-left: 6px;
  cursor: pointer;
}
.title {
  color: #666;
}
.line {
  display: block;
  width: 100%;
  height: 1px;
  background-color: #DCDFE6;
  margin: 10px 0;
}
</style>
<style lang="scss">
  .user .el-badge__content.is-fixed {
    top: 6px;
    right: 12px;
  }
  .user-popover {
    font-size: 12px;
    .item {
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
  }
</style>
