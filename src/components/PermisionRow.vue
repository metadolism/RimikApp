<template>
  <div class="permisionRow fullWidth fCol aStart jStart"
  v-bind:class="{opened: expanded}" v-bind:style="{height: boxHeight + 'px'}">
    <div v-bind:class="{open: whileLoading}" class="load fCol aCenter jCenter">
      <i class="material-icons-round fCol aCenter jCenter">loop</i>
    </div>
    <div class="arrow" v-if="permissionObject.hasChild" v-bind:class="{open: expanded}">
      <i class="material-icons-round">keyboard_arrow_down</i>
    </div>
    <!-- main item renders s here ↓ -->
    <permision-item :pTitle="permissionObject.title" :pIcon="permissionObject.icon"
    :pLocPath="permissionObject.localPath" :pServerPath="permissionObject.serverPath"
    :pMethod="permissionObject.method" :pId="permissionObject.id"
    :pState="permissionObject.state" :pHasChild="permissionObject.hasChild"
    :permissionData="permissionObject" @click.native="getPermissions"/>
    <!-- expand list render here ↓ -->
    <div id="expnd" class="expandList fullWidth">
      <permision-item
      v-for="item in permissionsData" v-bind:key="item.id"
      :pTitle="item.title" :pIcon="item.icon"
      :pLocPath="item.localPath" :pServerPath="item.serverPath"
      :pMethod="item.method" :pId="item.id" :pHasChild="item.hasChild"
      :pParentId="item.parentId"
      v-bind:style="{height: expndHeight + 'px'}"
      :pState="item.state"/>
    </div>
  </div>
</template>

<script>
import PermisionItem from '@/components/PermisionItem.vue';
import axios from 'axios';

export default {
  data() {
    return {
      expanded: false,
      whileLoading: false,
      expndHeight: 0,
      isDataLoaded: false,
      pTtl: '',
      pIcn: '',
      boxHeight: 72,
      permissionData: [],
      permissionsData: [],
      isPermissionsLoaded: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  props: ['permissionObject', 'permissionsArray'],
  methods: {
    expandRow() {
      // const expaand = document.getElementById('expnd');
      if (this.$store.state.letExpand) {
        if (this.permissionObject.hasChild) {
          // console.log('tedade zir majmooe', this.permissionsArray.length);
          if (this.expanded) {
            this.expanded = false;
            this.boxHeight = 72;
            this.expndHeight = 72;
          } else {
            this.expanded = true;
            this.expndHeight = 72;
            this.boxHeight = (this.permissionsData.length + 1) * 72;
          }
        } else {
          // console.log('tedade zir majmooe', this.permissionsArray.length);
        }
      }
    },
    getPermissions() {
      if (this.$store.state.letExpand) {
        // اگر بسته بود
        if (this.expanded === false) {
          // اگر زیر مجموعه داست
          if (this.permissionObject.hasChild) {
            this.whileLoading = true;
            const perid = this.permissionObject.id;
            axios({
              method: 'get',
              headers: {
                Authorization: this.$authObeject.authToken(),
              },
              url: `${this.baseURL}/api/v${this.V}/Permissions?parentId=${perid}`,
            }).then((response) => {
              // JSON responses are automatically parsed.
              this.posts = response.data;
              if (response.data.isSuccess) {
                this.permissionsData = JSON.parse(JSON.stringify(this.posts.data));
                this.whileLoading = false;
                if (this.permissionObject.hasChild) {
                  this.expandRow();
                }
              }
              // console.log(this.permissionsArray);
            }, (error) => {
              this.whileLoading = false;
              this.makeToast('error', this.errorHandler(error), 2000);
            });
          }
        } else {
          this.expandRow();
        }
      }
    },
  },
  components: {
    PermisionItem,
  },
  mounted() {
    // this.permissionData = this.permissionObject;
    // const p = JSON.parse(JSON.stringify(this.permissionObject));
    // this.permissionData = p.data[0].permission;
    // this.permissionsData = JSON.parse(JSON.stringify(p.data[1].permissions[0]));
    // this.pTtl = p.data[0].permission.title;
    // this.isDataLoaded = true;
    // console.log('hey', this.permissionData);
    // console.log('hey', this.permissionsData);
  },
};
</script>

<style lang="scss" scoped>

.permisionRow.opened{
    background-color: rgba($color: #000000, $alpha: 0.05) !important;
    margin: 8px 0px;
    border-right: solid 2px #00000069;
    overflow: hidden;
    border-radius: 0px !important;
}

.permisionRow .arrow{
  position: absolute;
  top: 28px;
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
  transform: rotate(-180deg);
}

.expandList{
    transform-origin: top center;
    overflow: hidden;
    background-color: rgba($color: #000000, $alpha: 0.05);
    transition: all cubic-bezier(0.5,0,0,1) 0.5s;
}

.permisionRow {
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  border-radius: 0px;
  overflow: auto;
  position: relative;
  margin: 4px 0px;
  border-right: solid 2px #00000023;
  height: 72px;
}

.permisionRow .load{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: none;
  z-index: 3000;
  background-color: rgba(255, 255, 255, 0.747);
}

.load.open {
  display: flex;
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
