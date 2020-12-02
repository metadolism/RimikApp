<template>
  <div class='card fRow jStart aStart wrap surface' v-bind:style='styleObject'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['w', 'minWidth', 'maxWidth'],
  data() {
    return {
      calcWidth: this.division,
      styleObject: {
        width: `${this.w}`,
        minWidth: `${this.minWidth}`,
        maxWidth: `${this.maxWidth}`,
      },
    };
  },
};
</script>

<style lang='scss' scoped>
.card {
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 32px;
  align-content: flex-start;
}
</style>
