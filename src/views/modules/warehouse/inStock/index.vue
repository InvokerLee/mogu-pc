<template>
  <base-wrapper>
    <main-list @rowClickChange="rowClickChange"></main-list>
    <detail-list :row="selectRow"></detail-list>
  </base-wrapper>
</template>

<script>
import mainList from './components/mainList';
import detailList from './components/detailList';
export default {
  name: 'inStock',
  components: {
    mainList,
    detailList
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
