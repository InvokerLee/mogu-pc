<template>
  <base-wrapper>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="供应商采购汇总" name="supplier">
        <supplier ref="supplier"></supplier>
      </el-tab-pane>
      <el-tab-pane label="产品采购汇总" name="production">
        <production ref="production"></production>
      </el-tab-pane>
    </el-tabs>
  </base-wrapper>
</template>

<script>
import supplier from './components/supplier';
import production from './components/production';
export default {
  name: 'purchase',
  components: {
    supplier,
    production
  },
  data() {
    return {
      activeName: 'supplier'
    };
  },
  methods: {
    handleClick() {
      this.$nextTick(() => {
        this.$refs[this.activeName].resizeTableListener();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
