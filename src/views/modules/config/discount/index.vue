<template>
  <base-wrapper>
    <main-list @rowClickChange="rowClickChange"></main-list>
    <detail-list :rowId="row.id" :rowState="row.state"></detail-list>
  </base-wrapper>
</template>

<script>
import mainList from './components/mainList';
import detailList from './components/detailList';
export default {
  name: 'discount',
  components: {
    mainList,
    detailList
  },
  data() {
    return {
      row: {}
    };
  },
  methods: {
    rowClickChange(row) {
      this.row = row || {};
    }
  }
};
</script>
