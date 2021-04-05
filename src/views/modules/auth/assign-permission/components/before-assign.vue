<template>
  <el-dialog
    width="540px"
    title="请确认本次授权内容"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <div class="before-assign">
      <div class="section-title" v-if="addItems.length">【新增】</div>
      <div class="section-content">
        <div class="item" v-for="i in addItems" :key="i.id">
          {{ i.parentListText }}
        </div>
      </div>
      <div class="section-title" v-if="delItems.length">【删除】</div>
      <div class="section-content">
        <div class="item" v-for="i in delItems" :key="i.id">
          {{ i.parentListText }}
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确认保存</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: ['visible', 'addItems', 'delItems'],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.before-assign {
  max-height: 500px;
  overflow: auto;
  .section-title {
    color: blue;
  }
  .section-content {
    padding: 10px 0;
  }
  .item {
    line-height: 1.5;
  }
}
</style>
