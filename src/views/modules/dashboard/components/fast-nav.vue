<template>
  <el-card class="fast-nav">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <strong>快捷菜单</strong>
      </el-row>
    </div>
    <el-row type="flex">
      <div v-for="item in array" :key="item.label" class="item" @click="goto(item)">
        <section class="top">
          <template v-if="item.type === 'icon'">
            <i :class="item.class" />
          </template>
          <template v-else-if="item.type === 'image'">
            <img :src="item.img" alt="">
          </template>
          <div v-else-if="item.type === 'ruku'">
            <img :src="require('@/assets/imgs/dashboard/u167.png')" alt="">
            <el-row type="flex" justify="space-around" align="bottom" style="margin-top: -10px;">
              <img :src="require('@/assets/imgs/dashboard/u169.png')" alt="">
              <img :src="require('@/assets/imgs/dashboard/u175.png')" alt="">
              <img :src="require('@/assets/imgs/dashboard/u171.png')" alt="">
              <img :src="require('@/assets/imgs/dashboard/u173.png')" alt="">
            </el-row>
          </div>
          <template v-else-if="item.type === 'sale-detail'">
            <el-row
              type="flex"
              justify="center"
              align="middle"
              class="sale-detail"
            >
              <img :src="require('@/assets/imgs/dashboard/u210.png')" alt="">
            </el-row>
            <div class="line" />
          </template>
          <template v-else-if="item.type === 'sale'">
            <el-row
              type="flex"
              justify="center"
              align="middle"
              class="sale"
            >
              <img :src="require('@/assets/imgs/dashboard/u213.png')" alt="">
            </el-row>
          </template>
          <template v-else-if="item.type === 'member'">
            <el-row
              type="flex"
              justify="center"
              align="middle"
              class="member"
            >
              <img :src="require('@/assets/imgs/dashboard/u178.png')" alt="">
            </el-row>
          </template>
        </section>
        <div class="label">{{ item.label }}</div>
      </div>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      array: [
        {
          url: 'discount',
          label: '促销管理',
          class: 'el-icon-plus border',
          type: 'icon'
        },
        {
          url: 'orderList',
          label: '订单中心',
          img: require('@/assets/imgs/dashboard/u194.png'),
          type: 'image'
        },
        {
          url: 'outStock',
          label: '出库单据',
          img: require('@/assets/imgs/dashboard/u197.png'),
          type: 'image'
        },
        {
          url: 'inStock',
          label: '入库单据',
          type: 'ruku'
        },
        {
          url: 'stock',
          label: '库存查询',
          img: require('@/assets/imgs/dashboard/u203.png'),
          type: 'image'
        },
        {
          url: 'saleData',
          label: '销售明细表',
          type: 'sale-detail'
        },
        {
          url: 'cusAndGoods',
          label: '销售汇总表',
          type: 'sale'
        },
        {
          url: 'stockChangeHistory',
          label: '出入库记录',
          img: require('@/assets/imgs/dashboard/u217.png'),
          type: 'image'
        },
        {
          url: 'member',
          label: '会员管理',
          type: 'member'
        }
      ]
    };
  },
  methods: {
    goto(item) {
      this.$router.push({ name: item.url });
    }
  }
};
</script>

<style lang="scss" scoped>
.fast-nav {
  margin-top: 20px;
  .item {
    width: 110px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .top {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      text-align: center;
    }
    &:hover {
      cursor: pointer;
      background: #efefef;
      border: 1px solid #ddd;
      .label {
        color: #42B983;
      }
    }
    .label {
      font-size: 12px;
      margin-top: 16px;
    }
    .border {
      font-size: 24px;
      padding: 10px;
      color: rgb(135, 135, 135);
      border: medium solid rgb(160, 160, 160);
      border-radius: 3px;
    }
    .sale-detail {
      background: url('~@/assets/imgs/dashboard/u206.png') no-repeat;
      width:50px;
      height:39px;
      .line {
        width: 35px;
        margin: 0 auto;
        border: 2px solid rgb(150,150,150);
        border-radius: 2px;
        margin-top: 3px;
      }
    }
    .sale {
      background: url('~@/assets/imgs/dashboard/u215.png') no-repeat;
      width:48px;
      height:48px;
    }
    .member {
      background: url('~@/assets/imgs/dashboard/u180.png') no-repeat;
      width:50px;
      height:50px;
    }
  }
}
</style>
