<template>
  <div
   v-bind:style="{ width: `calc(${this.inpWidth}% - 8px)`}"
   id="inputHolder">
    <div class="top-row fRow jStart aCenter">
      <p>{{ label }}</p>
      <span v-bind:class="{ dNone: noLenNeed}">{{ inpLen }}/{{ a }}</span>
    </div>
    <div class="ih">
      <input
        v-bind:class="{ err: warn }"
        v-model="message"
        :type="inputType"
        v-on:change="emitToParent"
        :autocomplete="complete"
        :placeholder="place"
      />
      <i class="material-icons-round">{{ icon }}</i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lotfi-input',
  data() {
    return {
      a: this.len,
      message: '',
      err: false,
      warn: false,
      isActive: false,
      phoneValue: 0,
      formattedPhoneValue: '0',
      preventNextIteration: false,
      collectedBody: {},
    };
  },
  props: ['len', 'validation', 'inputType', 'label', 'place', 'req',
    'icon', 'patern', 'noLimit', 'complete', 'inpWidth', 'valFor', 'val'],
  computed: {
    inpLen() {
      const ml = this.message;
      return ml.length;
    },
    errorFlag() {
      let cob = false;
      if (!this.noLimit) {
        if (this.message.length > this.a) {
          cob = true;
        }
      }
      return cob;
    },
    noLenNeed() {
      let nln = false;
      if (this.noLimit) {
        nln = true;
      }
      return nln;
    },
  },
  methods: {
    emitToParent() {
      this.$emit('childToParent', [this.valFor, this.message]);
    },
  },
};
</script>

<style lang="scss" scoped>
#inputHolder {
  background-color: rgba(0, 0, 0, 0);
}

.dNone{
  display: none;
}

.top-row {
  padding: 8px 12px 0px 12px;
}

.top-row p {
  padding: 0;
  margin: 0;
  flex-grow: 1;
  color: rgb(75, 75, 75);
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
  color: rgb(22, 22, 22);
}

.ih input {
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: solid 2px rgb(180, 180, 180);
  background-color: #00000000;
  color: rgb(27, 27, 27);
  padding: 8px 16px;
  text-align: center;
  transition: all ease-in-out 0.3s;
}

#inputHolder input:focus {
  outline: none;
  border: solid 2px rgb(73, 73, 73);
}
</style>
