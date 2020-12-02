<template>
  <div id="inputHolder">
    <div class="top-row fRow jStart aCenter">
      <p>{{ label }}</p>
      <span v-bind:class="{ dNone: noLenNeed}">{{ inpLen }}/{{ a }}</span>
    </div>
    <div class="ih">
      <input
        @change="acceptNumber"
        @input="whenInput"
        v-bind:class="{ err: warn }"
        v-model="message"
        :type="inputType"
        :autocomplete="complete"
        :placeholder="place"
      />
      <i class="material-icons-round">{{ icon }}</i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'l-input',
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
    };
  },
  props: ['len', 'validation', 'inputType', 'label', 'place', 'icon', 'patern', 'noLimit', 'complete'],
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
    whenInput() {
      if (this.validation === 'phone') {
        const x = this.message.replace(/\D/g, '').match(/(\d{0,4})(\d{0,3})(\d{0,4})/);
        this.message = !x[2] ? x[1] : `${x[1]}${x[2]}${x[3] ? `${x[3]}` : ''}`;
        if (this.message.length === 11) {
          this.acceptNumber();
        }
      }

      if (this.validation === 'captcha') {
        const letter = /^[0-9a-zA-Z]+$/i;
        if (!this.message.match(letter)) {
          console.log('صفحه کلید را به حالت انگلیسی تغییر دهید یا از کارکترهای مجاز استفاده کنید');
          this.message = this.message.substr(0, this.message.length - 1);
        }
        if (this.message.length > 4) {
          this.message = this.message.substr(0, 5);
          this.acceptNumber();
        } else {
          console.log('کمتر از حد مجاز');
        }
      }
      if (this.validation === 'numberCode') {
        // const letters = /a{3}/g;
        // const ll = this.message.length;
        if (this.message.length > 6) {
          this.message = this.message.substr(0, this.message.length - 1);
          // console.log('heeeeeeeeeeeeee');
        }

        if (this.message.length === 6) {
          this.acceptNumber();
        }
      }
    },
    acceptNumber() {
      // validation for true phone number
      if (this.validation === 'phone') {
        if (this.message.length === 11) {
          console.log('11');
          this.warn = false;
        } else {
          this.warn = true;
        }

        // if (this.message.length > this.a) {
        //   this.message = this.message.substr(0, this.a);
        //   console.log('ok');
        //   this.warn = false;
        // }
        // else {
        //   console.log('کمتر از حد مجاز');
        //   this.warn = true;
        // }
        // console.log('warn', this.warn);
      }

      // validation for captcha
      if (this.validation === 'captcha') {
        if (this.message.length > 4) {
          this.warn = false;
        } else {
          this.warn = true;
        }
      }

      // validation for password
      if (this.validation === 'password') {
        console.log('pass');
      }

      if (this.validation === 'numberCode') {
        if (this.message.length > 5) {
          this.message = this.message.substr(0, 6);
          this.warn = false;
        } else {
          this.warn = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#inputHolder {
  flex-grow: 1;
  background-color: rgba(255, 255, 255, 0);
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
