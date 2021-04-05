<style lang="scss" scoped>
.editSpan{
  display: inline-block;
  &.paddingspan{
    padding: 0 6px;
  }
}
</style>

<template>
  <span class="editSpan" :class="{paddingspan: !value}" contenteditable="true" @blur="inputFn">
    {{ value }}
  </span>
</template>

<script>
export default {
  name: 'editSpan',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
  methods: {
    inputFn(e) {
      const txt = (e.target.innerText || '').trim();
      e.target.innerHTML = txt;
      this.$emit('input', txt);
    },
  },
};
</script>
