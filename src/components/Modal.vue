<template>
  <div class="modalBody fRow jCenter aCenter">
      <div class="modalCloser" @click="closeIt"></div>
      <div class="modalSlot aCenter jCenter fCol">
          <slot></slot>
      </div>
  </div>
</template>

<script>

export default {
  methods: {
    closeIt() {
      this.$store.commit('closeCard');
      // this.changeMsg();
      // this.say();
    },
    changeMsg() {
      this.$emit('changeMsg', 'hey');
      // console.log('message emit from child component');
    },
  },
};
</script>

<style lang="scss" scoped>
  .modalBody{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 60000000;
    background-color: #61187abd;
  }
  .modalCloser{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
  }

  .modalSlot{
    position: relative;
    z-index: 200;
  }
</style>
