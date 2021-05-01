<template>
  <base-wrapper>
    <main-list @rowClickChange="rowClickChange"></main-list>
    <detail-list :rowId="selectRowId"></detail-list>
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
