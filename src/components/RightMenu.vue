<template>
  <div v-bind:class="{ rightMenuOpened: menuDefState}"
  class="rightMenu secondary fCol jStart aCenter">
    <div class="firstItem fRow jStart aCenter primary" @click="toggleMenu">
      <div class="fCol growFull jStart aStart">
        <div class="rimikLogo"></div>
      </div>
      <div class="menuBtn" v-bind:class="{ open: menuDefState}"></div>
    </div>
    <ul class="menuHolder">
      <menu-item
        label="تعریف دسترسی‌ها"
        icon="tune"
        path="/access"
        step="1"
      />
      <menu-item
        label="پایه ها"
        icon="clear_all"
        path="/grades"
        step="1"
      />
      <menu-item
        label="درس ها"
        icon="menu_book"
        path="/lessons"
        step="1"
      />
      <menu-item
        label="دبیران"
        icon="school"
        path="/teachers"
        step="1"
      />
      <menu-item
        label="دوره‌ها"
        icon="ondemand_video"
        path="/courses"
        step="1"
      />
      <div @click="openMenu('settings')" data-opened="0" id="settings"
      v-if="false"
      class="fCol jStart aStart fullWidth itemGroup"></div>
    </ul>
  </div>
</template>

<script>
import MenuItem from '@/components/MenuItem.vue';

export default {
  name: 'right-menu',
  data() {
    return {
      isAnyItemOpened: false,
      openedGroup: '',
      menuDefState: false,
      menuSeen: false,
    };
  },
  components: {
    MenuItem,
  },
  props: ['open'],
  computed: {
    // inpLen() {
    //   const ml = this.message;
    //   return ml.length;
    // },
  },
  methods: {
    openMenu(igId) {
      const ig = document.getElementById(igId);
      const pig = document.getElementById(this.openedGroup);
      if (ig.getAttribute('data-opened') === '0') {
        if (this.openedGroup !== '') {
          pig.setAttribute('data-opened', '0');
          pig.style.height = '56px';
          pig.style.background = 'rgba(0,0,0,0)';
        }
        ig.setAttribute('data-opened', '1');
        ig.style.height = `${56 * ig.childElementCount}px`;
        ig.style.background = 'rgba(0,0,0,0.2)';
        this.openedGroup = igId;
        this.isAnyItemOpened = true;
        // console.log(this.openedGroup, window.location.pathname);
      }
    },
    firstHover() {
      setTimeout(() => {
        this.menuDefState = false;
      }, 200);
    },
    toggleMenu() {
      this.menuDefState = !this.menuDefState;
    },
  },

  mounted() {
    if (window.location.pathname === '/access') {
      // this.firstHover();
    }

    // this.$store.commit('mamadPlus');
  },
};
</script>

<style lang="scss" scoped>

  .itemGroup{
    height: 56px;
    overflow: hidden;
    transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  }

  .itemGroup:focus{
    background-color: rgba(0,0,0,0.2);
  }

  #users:focus{
    height: 224px;
  }

  #sale:focus, #support:focus, #settings:focus{
    height: 168px;
  }
</style>
