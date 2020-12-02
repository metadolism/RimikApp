<template>
  <div class="dashboard background">
    <dashboard-page pcontent="1" page="DASHBOARD">
      <btn
      label="ورود به سایت"
      icon="clear"
      />
    </dashboard-page>
    <tool-bar/>
    <right-menu/>
  </div>
</template>

<script>
import RightMenu from '@/components/RightMenu.vue';
import ToolBar from '@/components/ToolBar.vue';
import DashboardPage from '@/components/DashboardPage.vue';
import Btn from '@/components/Btn.vue';
import fp from '@/mixins/fp';

export default {
  mixins: [fp],
  methods: {
    initUserData() {
      // این اول صفحه اجرا میشه
      if (this.$store.state.fp === 'undefined') {
        this.fpGenerator().then(() => {
          this.$authObeject.checkDate().then((result) => {
            if (result) {
              // console.log('توکن منقضی شده، درخواست ریفرش توکن');
            } else {
              this.initPage();
            }
          });
        });
      } else {
        this.initPage();
      }
    },
    initPage() {
      // اینیت اولیه پیج
    },
  },
  mounted() {
    this.initUserData();
  },
  components: {
    RightMenu,
    ToolBar,
    DashboardPage,
    Btn,
  },
};
</script>

<style lang="scss" scoped>

</style>
