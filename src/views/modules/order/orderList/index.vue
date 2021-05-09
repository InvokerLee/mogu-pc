<template>
  <base-wrapper>
    <main-list @rowClickChange="rowClickChange"></main-list>
    <detail-list :row="selectRow"></detail-list>
  </base-wrapper>
</template>

<script>
import mainList from './mainList';
import detailList from './detailList';
export default {
  name: 'orderList',
  components: {
    mainList,
    detailList
  },
  data() {
    return {
      selectRow: ''
    };
  },
  methods: {
    rowClickChange(row) {
      this.selectRow = row || {};
    }
  }
};
</script>
