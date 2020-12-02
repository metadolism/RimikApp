<template>
  <a :href="path" class="fullWidth fRow jCenter aCenter userMenu">
    <div class="btnEffect"></div>
    <label>{{ label }}</label>
    <i class="material-icons-round">{{ icon }}</i>
  </a>
</template>

<script>
export default {
  data() {
    return {
      read: false,
      noNotify: false,
      ic: '',
    };
  },
  props: ['icon', 'label', 'path'],
  computed: {
    statusCheck() {
      let st2 = false;
      if (this.step === '2') {
        console.log(this.step);
        st2 = true;
      }
      return st2;
    },
    haveNoPage() {
      let hp = false;
      if (this.havePage === 'no') {
        console.log(this.havePage);
        hp = true;
      }
      return hp;
    },
  },
  mounted() {},
};
</script>

<style lang="scss">

.userMenu .btnEffect{
    position: absolute;
    left: 28px;
    top: 28px;
    width: 0px;
    height: 0px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.096);
    transition: all cubic-bezier(0.5, 0, 0, 1) 0.8s;
}

.userMenu:hover .btnEffect{
    width: 512px;
    height: 512px;
}

.userMenu{
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.userMenu i{
  color: white;
  margin-right: 8px;
  pointer-events: none;
}

.userMenu label{
  font-size: 14px;
  font-weight: 300;
  color: white;
  flex-grow: 1;
  pointer-events: none;
  text-align: right;
}

</style>
