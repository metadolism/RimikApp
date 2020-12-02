<template>
  <div class="buttonHolder fRow aCenter jCenter">
    <i class="material-icons-round">{{icon}}</i>
    <input
      :value="label"
      type="button"
    >
  </div>
</template>
<script>
export default {
  name: 'lbutton',
  data() {
    return {
    };
  },
  props: ['label', 'icon', 'isDisable'],
  computed: {
    inpLen() {
      // `this` points to the vm instance
      return this.message.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.buttonHolder {
  background-color: rgba(255, 255, 255, 0);
  position: relative;
  height: 48px;
  width: 100%;
  margin: 16px 0 0 0;
}

.buttonHolder input{
  padding: 8px 12px 8px 12px;
  border-radius: 96px;
  background-color: #7DBC53;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  height: 100%;
  text-align: center;
  flex-grow: 1;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1);
  cursor: pointer;
}

.buttonHolder input:focus{
  border: none;
  outline: none;
}

.buttonHolder i{
  position: absolute;
  top: 12px;
  right: 12px;
  pointer-events: none;
  color: white;
}

.err {
  border-color: red !important;
  color: red !important;
}

.top-row {
  padding: 8px 12px 0px 12px;
}

.top-row p {
  padding: 0;
  margin: 0;
  flex-grow: 1;
  color: white;
  font-size: 12px;
  margin-bottom: 8px;
  text-align: right;
}

.top-row span {
  font-weight: 700;
  color: orange;
  margin-right: 8px;
  font-size: 12px;
}

.ih {
  width: 100%;
  position: relative;
}

.ih i {
  position: absolute;
  top: 12px;
  right: 12px;
  color: white;
}

.ih input {
  width: 100%;
  height: 48px;
  border-radius: 48px;
  border: solid 2px white;
  background-color: #00000000;
  color: white;
  padding: 8px 16px;
  text-align: center;
}

#inputHolder input:focus {
  outline: none;
}
</style>
