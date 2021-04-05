<template>
  <el-row class="remark">
    <div class="wrapper" @click="lookRemarkDetail">
      <a class="content font-blue" v-for="(item, index) in remarkList" :key="`${item.created_at}${index}`">
        <span>{{ item.remark }}，{{ item.user }}，{{ item.created_at }}；</span>
        <br />
      </a>
    </div>
    <!-- 备注弹框详情 -->
    <el-dialog
      width="640px"
      v-if="detailDialog.visible"
      :modal-append-to-body="true"
      :visible.sync="detailDialog.visible"
      :title="detailDialog.title"
      :close-on-click-modal="false"
    >
      <div class="remark-scroll">
        <div v-for="(item, index) in remarkList" :key="`${item}${index}`">
          <div>{{ item.remark }}</div>
          <div class="desc font-gray">{{ item.created_at }} {{ item.user }}</div>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  props: ['visible', 'remarkList'],
  data() {
    return {
      loading: false,
      detailDialog: {
        visible: false,
        title: '备注详情',
      },
    };
  },
  methods: {
    lookRemarkDetail() {
      this.detailDialog.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.remark {
  .wrapper {
    max-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    .content {
      font-size: 12px;
      .name {
        padding-right: 15px;
      }
    }
  }
  .remark-scroll {
    padding: 0 30px;
    max-height: 380px;
    overflow: auto;
    .desc {
      padding: 10px 0;
      margin-bottom: 10px;
      border-bottom: 1px #e6ebf5 solid;
    }
  }
}
</style>
