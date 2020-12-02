<template>
  <a href="#"
  class="notifyItem fullWidth fRow jStart aStart">
    <i v-bind:class="{ unread: !read && !noNotify}" class="material-icons-round">{{ ic }}</i>
    <div v-if="!noNotify" class="fCol jStart aStart growFull">
      <div class="notifySender">از طرف: {{ sender }}</div>
      <div class="notifyMsg">{{ msg }}</div>
    </div>
    <div v-if="noNotify" class="notifyMsg">شما هیچ اعلانی ندارید</div>
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
  props: ['sender', 'msg', 'status'],
  computed: {
    statusCheck() {
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
  mounted() {
    if (this.status === 'nothing') {
      this.noNotify = true;
      this.ic = 'notifications_off';
    } else if (this.status === 'read') {
      this.read = true;
      this.ic = 'notifications_none';
    } else if (this.status === 'unread') {
      this.read = false;
      this.ic = 'notifications_active';
    }
    // console.log('nothing', this.noNotify);
    // console.log('read', this.read);
  },
};
</script>

<style lang="scss">

.notifyItem{
  padding: 16px;
  color: white;
  text-align: right;
  transition: all cubic-bezier(0.5,0,0,1) 0.3s;
  border-bottom: solid 1px rgba(0, 0, 0, 0.123);
  align-content: center;
}

.notifyItem:hover{
  background-color: rgba(0, 0, 0, 0.123);
}

.notifyItem i{
  margin-left: 16px;
}

.notifySender{
  font-size: 12px;
  font-weight: 200;
  width: 100%;
  color: rgba(255, 255, 255, 0.575);
}

.notifyMsg{
  font-size: 12px;
  font-weight: 500;
  width: 100%;
}

.unread{
  color: rgb(250, 204, 0);
}

</style>
