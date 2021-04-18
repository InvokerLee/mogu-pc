<template>
  <base-wrapper>
    <main-list @rowClickChange="rowClickChange"></main-list>
    <detail-list :rowId="selectRowId"></detail-list>
  </base-wrapper>
</template>

<script>
import mainList from './components/mainList';
import detailList from './components/detailList';
export default {
  name: 'returnTracking',
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
      this.selectRowId = row.id;
    }
  }
};
</script>
