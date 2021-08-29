<template>
  <el-select
    v-model="params[paramsKey]"
    style="width: 100%;"
    :clearable="!multiple"
    :multiple="multiple"
    :collapse-tags="multiple"
    readonly
    reserve-keyword
    placeholder="请选择品牌"
    filterable
    :loading="loading"
    @change="change"
  >
    <el-option
      v-for="i in options"
      :key="i.id"
      :label="i.name"
      :value="i.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import { commonSelectBrand } from '@/api/common';
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
    this.getOptions();
  },
  methods: {
    getOptions() {
      this.loading = true;
      commonSelectBrand().then((res) => {
        this.options = res.result;
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
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
