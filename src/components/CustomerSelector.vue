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
    placeholder="模糊查询有效客户"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="change"
  >
    <el-option
      v-for="i in options"
      :key="i.guestId"
      :label="i.guestName"
      :value="i.guestId"
    >
    </el-option>
  </el-select>
</template>

<script>
import { commonSelectGuest } from '@/api/common';

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
  watch: {
    defaultOpions(val) {
      if (val) {
        this.options = val;
      }
    }
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
      commonSelectGuest({
        name: query,
        orderType: 'other'
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
        arr = val.map(guestId => this.options.find(v => v.guestId === guestId));
      } else {
        const item = this.options.find(v => v.guestId === val);
        if (item) {
          arr.push(item);
        }
      }

      this.$emit('selectChange', arr);
    }
  }
};
</script>
