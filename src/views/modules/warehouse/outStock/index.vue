<template>
  <base-wrapper>
    <main-list @rowClickChange="rowClickChange"></main-list>
    <!-- <detail-list :rowId="selectRow.id"></detail-list> -->
  </base-wrapper>
</template>

<script>
import mainList from './components/mainList';
// import detailList from './components/detailList';
export default {
  name: 'outStock',
  components: {
    mainList
    // detailList
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
