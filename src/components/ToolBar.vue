<template>
  <div class="toolBar primary fRow jStart aCenter">
    <div class="firstItem fRow jStart aCenter primary">
      <div class="fCol growFull jStart aStart">
        <a class="rimikLogo" href="https://panel.rimik.ir"></a>
      </div>
    </div>
    <div class="leftOptions fRow jEnd aCenter fullWidth">
      <div id="profile" @click="tbOptionMenu('profile')"
      tabindex="5" class="toolBarOption jCenter aCenter fRow">
        <div class="bcCloser"></div>
        <div class="username">{{this.$store.state.name}} {{this.$store.state.lname}}</div>
        <i class="material-icons-round">account_box</i>
        <div id="profileDropDown" class="dropDownMenu secondary fCol jStart aStart">
          <profile-item label="پروفایل" icon="account_box" path="/profile" />
          <profile-item label="تغییر رمز عبور" icon="vpn_key" path="/forgot" />
          <profile-item label="خروج از حساب" icon="exit_to_app" path="/" @click.native="logout" />
        </div>
      </div>
      <div id="notifications" @click="tbOptionMenu('notifications')"
       tabindex="6" class="toolBarOption jCenter aCenter fCol">
        <div class="bcCloser"></div>
        <i class="material-icons-round">notifications_none</i>
        <div id="notifyDropDown" class="dropDownMenu secondary fCol jStart aStart">
          <notify-item status="unread" sender="مدیر کل"
          msg="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
          صنعت چاپ و با استفاده از طراحان گرافیک است " />
          <notify-item status="read" sender="مدیر کل"
          msg="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
          صنعت چاپ و با استفاده از طراحان گرافیک است " />
          <notify-item status="nothing" sender="مدیر کل"
          msg="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
          صنعت چاپ و با استفاده از طراحان گرافیک است " />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotifyItem from '@/components/NotifyItem.vue';
import ProfileItem from '@/components/ProfileItem.vue';

export default {
  name: 'right-menu',
  data() {
    return {
      openedOption: '',
      isOpenOption: false,
    };
  },
  components: {
    NotifyItem,
    ProfileItem,
  },
  props: [],
  computed: {
    // inpLen() {
    //   const ml = this.message;
    //   return ml.length;
    // },
  },
  methods: {
    tbOptionMenu(optionID) {
      if (this.openedOption !== optionID) {
        if (this.openedOption === '') {
          this.openedOption = optionID;
          // console.log(this.openedOption, 'alan baz shod');
          document.getElementById(this.openedOption).classList.add('opened');
        } else {
          // console.log(this.openedOption, 'alan baste shod');
          document.getElementById(this.openedOption).classList.remove('opened');
          this.openedOption = optionID;
          // console.log(this.openedOption, 'alan baz shod');
          document.getElementById(this.openedOption).classList.add('opened');
        }
      } else {
        // console.log(this.openedOption, 'alan baste shod');
        document.getElementById(this.openedOption).classList.remove('opened');
        this.openedOption = '';
      }
    },
    test(e) {
      if (e.target.id === 'myDiv') {
        // alert('Inside div');
      } else {
        // alert('Outside div');
      }
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.go();
    },
  },
};
</script>

<style lang="scss" scoped>

.toolBar{
  position: fixed;
  height: 56px;
  top: 0;
  left: 0;
  right: 56px;
  box-shadow: 0 8px 24px 0 rgba($color: #000000, $alpha: 0.15);
}

.toolBarOption{
  width: 56px;
  height: 56px;
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  position: relative;
}

.toolBarOption:focus{
  outline: none;
}

.toolBarOption:hover{
  background-color: #41005783;
}

.toolBarOption i{
  color: white;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.123);
}

.bcCloser{
  position: absolute;
  background-color: rgba(255, 255, 0, 0);
  top: 50%;
  left: 50%;
  width:  0vw;
  height: 0vh;
  transform: translate(-50%, -50%);
}

.dropDownMenu{
  position: absolute;
  top: 100%;
  left: 0;
  max-height: 80vw;
  overflow-x: hidden;
  overflow-y: auto;
  transform: scale(1, 0);
  transform-origin: top center;
    transition: all cubic-bezier(0.5,0,0,1) 0.3s;
}

#profileDropDown{
  width: 196px;
}

#notifyDropDown{
  width: 256px;
}

.toolBarOption.opened .dropDownMenu{
  transform: scale(1, 1);
}

.toolBarOption.opened{
  background-color: #410057;
}

.toolBarOption.opened .bcCloser{
  width: 200vw;
  height: 200vh;
}

#profile{
  width: unset;
  padding: 8px 16px;
}

.username{
  margin-left: 16px;
  font-size: 12px;
  font-weight: 400;
  color: white;
}
</style>
