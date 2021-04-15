<template>
  <el-autocomplete
    v-model="params[paramsKey]"
    style="width: 100%;"
    :fetch-suggestions="querySearchAsync"
    placeholder="类别关键字"
  ></el-autocomplete>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    paramsKey: {
      type: String,
      default: ''
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        cb([]);
        return;
      }
      const params = {
        searchKey: queryString
      };
      console.log(params);

      setTimeout(() => {
        cb([{ value: '123123' }, { value: 'fas' }]);
      }, 1200);
    }
  }
};
</script>
