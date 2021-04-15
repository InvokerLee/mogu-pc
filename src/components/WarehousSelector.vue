<template>
  <el-select
    v-model="params[paramsKey]"
    style="width: 100%;"
    filterable
    remote
    :clearable="!multiple"
    :multiple="multiple"
    :collapse-tags="multiple"
    reserve-keyword
    placeholder="仓库"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="change"
  >
    <el-option
      v-for="i in options"
      :key="i.id"
      :label="i.label"
      :value="i.id"
    >
    </el-option>
  </el-select>
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
    },
    defaultOpions: {
      type: Array,
      default() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      options: []
    };
  },
  created() {
    if (this.defaultOpions) {
      this.options = this.defaultOpions;
    }
  },
  methods: {
    remoteMethod(query) {
      if (query === '') {
        this.options = [];
        return;
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.options = [{ id: 1, label: '仓库1' }, { id: 2, label: '仓库2' }];
      }, 200);
    },
    change(val) {
      let arr = [];
      if (this.multiple) {
        arr = val.map(id => this.options.find(v => v.id === id));
      } else {
        const item = this.options.find(v => v.id === val);
        if (item) {
          arr.push(item);
        }
      }

      this.$emit('selectChange', arr);
    }
  }
};
</script>
