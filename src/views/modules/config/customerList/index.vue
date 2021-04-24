<template>
  <base-wrapper>
    <headquarters @rowClickChange="rowClickChange"></headquarters>
    <branch-list :rowId="selectRowId"></branch-list>
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
      selectRowId: ''
    };
  },
  methods: {
    rowClickChange(row) {
      this.selectRowId = row ? row.id : '';
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
