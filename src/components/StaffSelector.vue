<template>
  <el-select
    v-model="params[paramsKey]"
    style="width: 100%;"
    :clearable="!multiple"
    :multiple="multiple"
    :collapse-tags="multiple"
    readonly
    reserve-keyword
    placeholder=""
    filterable
    :loading="loading"
    @change="change"
    @focus="remoteMethod"
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
import { commonStaff } from '@/api/common';
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
    },
    staffType: {
      type: Number,
      default: 0 // 业务员
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
    remoteMethod() {
      this.loading = true;
      commonStaff({
        staffType: this.staffType
      }).then((res) => {
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
