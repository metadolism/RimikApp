<template>
  <div class="permisionRow fullWidth fCol aCenter jStart"
  v-bind:class="{opened: expanded}" v-bind:style="{height: expndHeight + 'px'}">
    <!-- loading  -->
    <div v-bind:class="{open: whileLoading}" class="load fCol aCenter jCenter">
      <i class="material-icons-round fCol aCenter jCenter">loop</i>
    </div>

    <!-- main item renders here ↓ -->
    <access-item
    @click.native="getAccessPermissions"
    :aId="accessData.id"
    :aTitle="accessData.title"
    :aDesc="accessData.description"
    :aState="accessData.status"
    :aPermissions="accessData.permissionsId" />

    <!-- arrow -->
    <div class="arrow" v-bind:class="{open: expanded}">
      <i class="material-icons-round">keyboard_arrow_down</i>
    </div>

    <!-- expand list render here ↓ -->
    <div id="expnd" class="expandList fullWidth fCol jStart aStart" v-if="this.expanded">
      <div class="fullWidth text-right tt">مجوزهای مربوط به این دسترسی</div>
      <div v-for="item in this.permissionsData"
      v-bind:key="item.id"
      class="permissionCheap info fRow jCenter aCenter">
        <i class="material-icons-round">{{item.icon}}</i>
        <div class="cheapLabel">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import AccessItem from '@/components/AccessItem.vue';
import axios from 'axios';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';

export default {
  mixins: [errorHandler, makeToast],
  data() {
    return {
      expanded: false,
      whileLoading: false,
      expndHeight: 0,
      isDataLoaded: false,
      pTtl: '',
      pIcn: '',
      boxHeight: 88,
      accessData: [],
      accArray: this.accessArray,
      permissionsData: [],
      isPermissionsLoaded: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  computed: {},
  props: ['accessObject', 'accessArray'],
  methods: {
    expandRow() {
      // const expaand = document.getElementById('expnd');
      if (this.$store.state.letExpand) {
        if (this.expanded) {
          this.expanded = false;
          this.boxHeight = 88;
          this.expndHeight = 88;
        } else {
          this.expanded = true;
          // const h = document.getElementById('expnd').scrollHeight;
          // console.log('h', h + 88);
          this.expndHeight = (this.permissionsData.length * 34) + 148;
          this.boxHeight = 88;
        }
      }
    },
    getAccessPermissions() {
      if (this.$store.state.letExpand) {
        // اگر بسته بود
        if (this.expanded === false) {
          // اگر زیر مجموعه داست
          this.whileLoading = true;
          axios({
            method: 'post',
            headers: {
              Authorization: this.$authObeject.authToken(),
            },
            url: `${this.baseURL}/api/v${this.V}/Permissions/ids`,
            data: {
              permissionsId: this.accArray,
            },
          }).then((response) => {
            this.posts = response.data;
            // JSON responses are automatically parsed.
            this.posts = response.data;
            // console.log('return from ids', this.posts);
            this.whileLoading = false;
            if (response.data.isSuccess) {
              this.permissionsData = JSON.parse(JSON.stringify(this.posts.data));
              this.expandRow();
            }
          }, (error) => {
            this.makeToast('error', this.errorHandler(error), 3000);
          });
        } else {
          this.expandRow();
        }
      }
    },
  },
  components: {
    AccessItem,
  },
  mounted() {
    this.accessData = this.accessObject;
    // const p = JSON.parse(JSON.stringify(this.permissionObject));
    // this.permissionData = p.data[0].permission;
    // this.permissionsData = JSON.parse(JSON.stringify(p.data[1].permissions[0]));
    // this.pTtl = p.data[0].permission.title;
    // this.isDataLoaded = true;
    // console.log('hey', this.permissionData);
    // console.log('id=', this.accessData.id);
  },
};
</script>

<style lang="scss" scoped>

.permisionRow {
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  border-radius: 0px;
  overflow: auto;
  position: relative;
  margin: 4px 0px;
  border-right: solid 2px #00000023;
  height: 88px;
  min-height: 88px;
}

.permisionRow .load{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: none;
  background-color: rgba(255, 255, 255, 0.747);
}

.permisionRow.opened{
  background-color: rgba($color: #000000, $alpha: 0.05) !important;
  margin: 8px 0px;
  border-right: solid 2px #00000069;
  overflow: hidden;
  border-radius: 0px !important;
}

.permisionRow .arrow{
  position: absolute;
  transform: translateY(-50%) rotate(0deg);
  top: 36px;
  right: 8px;
  height: 16px;
  width: 16px;
  transition: all cubic-bezier(0.5, 0, 0, 1) 0.3s;
  pointer-events: none;
}

.arrow i{
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.arrow.open {
  transform: translateY(-50%) rotate(-180deg);
}

.permissionCheap {
  border-radius: 64px;
  padding: 4px 12px;
  margin: 0 0 8px 8px;
}

.permissionCheap i{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: white;
}

.permissionCheap .cheapLabel{
  font-size: 12px;
  font-weight: 300;
  color: white;
  margin-right: 8px;
}

.expandList{
    transform-origin: top center;
    overflow: hidden;
    padding: 16px;
    align-content: flex-start;
    background-color: rgba($color: #000000, $alpha: 0.05);
    transition: all cubic-bezier(0.5,0,0,1) 0.5s;
}

.tt {
  font-size: 12px;
  font-weight: 200;
  margin-bottom: 16px;
}

.load{
  z-index: 3000;
  height: 88px;
}

.load.open {
  display: flex;
  height: 88px;
}

.load i{
  width: 16px;
  height: 16px;
  display: flex;
  border-radius: 50%;
  background-color: rgba($color: #000000, $alpha: 0.25);
  font-size: 12px;
  animation: loadi infinite cubic-bezier(1,0,0,1) 1s;
}

@keyframes loadi{
  0%{
    box-shadow: 0 0 0 8px rgba($color: #000000, $alpha: 0.05);
    transform: rotate(0deg);
  }
  50%{
    box-shadow: 0 0 0 16px rgba($color: #000000, $alpha: 0.15);
  }
  100%{
    box-shadow: 0 0 0 8px rgba($color: #000000, $alpha: 0.05);
    transform: rotate(-360deg);
  }
}

</style>
