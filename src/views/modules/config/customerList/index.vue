<template>
  <base-wrapper>
    <headquarters @rowClickChange="rowClickChange"></headquarters>
    <branch-list :rowId="selectRow.id" :clientType="selectRow.clientType"></branch-list>
  </base-wrapper>
</template>

<script>
import headquarters from './components/headquarters';
import branchList from './components/branchList';
export default {
  name: 'customerList',
  components: {
    headquarters,
    branchList
  },
  data() {
    return {
      selectRow: {}
    };
  },
  methods: {
    rowClickChange(row) {
      this.selectRow = row || {};
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
