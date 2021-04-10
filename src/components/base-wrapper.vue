<template>
  <el-row class="base-wrapper" type="flex">
    <div v-if="showHead" class="wrapper-head">
      <slot name="head" />
    </div>
    <div class="wrapper-content">
      <slot />
    </div>
  </el-row>
</template>

<script>
export default {
  computed: {
    showHead() {
      return this.$slots.head;
    }
  }
};
</script>

<style lang="scss" scoped>
.base-wrapper {
  width: 100%;
  height: 100%;
  flex-direction : column;
  .wrapper-head {
    flex: 0 0 auto;
    height: 28px;;
    margin: 3px 3px 0;
    overflow: hidden;
  }
  .wrapper-content {
    height: 100%;
    margin-top: 3px;
    padding: 0 3px 3px;
    flex: 1 1 auto;
    overflow: auto;
  }
}
</style>
