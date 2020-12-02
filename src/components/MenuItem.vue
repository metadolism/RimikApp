<template>
  <li class="menuItemLi fRow jStart aCenter fullWidth">
    <div class="btnEffect"></div>
    <router-link class="rl"
      v-bind:class="{twoStep: stepCalculator, pointerEventNone: haveNoPage}"
      :to="path">
      <label class="menuItem">{{ label }}</label>
    </router-link>
    <i v-bind:class="{stepTwoIcon: stepCalculator}"
    class="itemIcon material-icons-round">{{ icon }}</i>
  </li>
</template>

<script>
export default {
  props: ['label', 'icon', 'path', 'step', 'havePage'],
  computed: {
    stepCalculator() {
      let st2 = false;
      if (this.step === '2') {
        // console.log(this.step);
        st2 = true;
      }
      return st2;
    },
    haveNoPage() {
      let hp = false;
      if (this.havePage === 'no') {
        // console.log(this.havePage);
        hp = true;
      }
      return hp;
    },
  },
};
</script>

<style lang="scss">
.rl label {
  color: white;
  flex-grow: 1;
  height: 56px;
  min-height: 56px;
  font-size: 14px;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding: 0 24px;
}

.rl.twoStep label{
  padding: 0 24px;
  margin-right: 24px;
  border-right: dashed 2px #61187A;
}

.pointerEventNone{
  pointer-events: none;
}

.menuItemLi {
  width: 100%;
  min-height: 56px;
  position: relative;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0);
  background-image: url('../assets/btnback.svg');
  background-size: 0px 56px;
  background-repeat: repeat-x;
  background-position: left center;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.5s;
}

.stepTwoIcon{
  color: #f0f0f050 !important;
}

.menuItemLi .btnEffect{
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

.menuItemLi:hover .btnEffect{
    width: 512px;
    height: 512px;
}

li:hover {
  background-color: rgba(0, 0, 0, 0.151);
}

.menuItemLi .itemIcon {
  color: white;
  position: absolute;
  top: 16px;
  left: 16px;
  pointer-events: none;
}

.rl {
    position: relative;
    width: 100%;
    overflow: hidden;
    cursor: pointer;
    padding: 0 !important;

    &.router-link-exact-active {
        border-left: solid 0px #61187A;
    }
    &.router-link-exact-active::after {
      content: " ";
      position: absolute;
      top: 20px;
      left: -12px;
      width: 16px;
      height: 16px;
      text-decoration: none;
      color: #42b983;
      background-color: #f0f0f0;
      transform: rotate(45deg);
    }
}
</style>
