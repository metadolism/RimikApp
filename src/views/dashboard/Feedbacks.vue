<template>
  <div class="dashboard background">
    <dashboard-page pcontent="0" page="FEED BACKS">content here</dashboard-page>
    <tool-bar/>
    <right-menu/>
  </div>
</template>

<script>
import RightMenu from '@/components/RightMenu.vue';
import ToolBar from '@/components/ToolBar.vue';
import DashboardPage from '@/components/DashboardPage.vue';

export default {
  methods: {},
  mounted() {},
  components: {
    RightMenu,
    ToolBar,
    DashboardPage,
  },
};
</script>

<style lang="scss" scoped>

</style>
