<template>
<div class="fullWidth fCol aCenter jStart">
  <div class='pRow fRow jBetween aCenter fullWidth'>
    <div class='tableHead title fCol jStart aCenter'>
      <div class="fullWidth accessTitle title">{{aTitle}}</div>
      <div :title="this.aDesc" class="fullWidth accessTitle desc">{{shortDesc}}</div>
    </div>
    <div class='tableHead state aCenter jCenter fCol'>
      <div v-if="false" v-bind:class="{off: !isActive, wait: whileState}" class="switch"
      @mouseover='disableExpand'
      @click="invertState"
      @mouseleave="enableExpand">
      <div class="l"></div>
        <div class="switchLabel" v-bind:class="{info: isActive, error: !isActive}">
          {{perState}}
        </div>
      </div>
      <switch-button
      activeLabel='فعال'
      deactiveLabel='غیرفعال'
      @click.native="invertState"
      :load='whileState'
      @mouseover.native='disableExpand'
      @mouseleave.native="enableExpand"
      :val='accessState' />
    </div>
    <div class='tableHead actions'>
      <i @mouseover='disableExpand'
      @click="editPermision"
      @mouseleave="enableExpand"
      class='material-icons-round'>edit</i>
      <i @mouseover='disableExpand'
      @click="deleteAccess"
      @mouseleave="enableExpand" class='material-icons-round'>clear</i>
    </div>
  </div>
  <!-- <div class="permissions">
    <div v-for="item in this.permissions" v-bind:key="item.id">{{item}}</div>
  </div> -->
</div>
</template>

<script>
import axios from 'axios';
import SwitchButton from '@/components/SwitchButton.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';
// import makeT from '@/mixins/mixin';
// mixins: [errorHandler],
// this.makeToast('error', this.errorHandler(error), 2000);
export default {
  mixins: [errorHandler, makeToast],
  data() {
    return {
      expanded: false,
      expndHeight: 0,
      permissions: this.aPermissions,
      isActive: false,
      whileState: false,
      accessState: false,
      accessId: this.aId,
      accessName: '',
      perMethod: '',
      perLocPath: '',
      perServerPath: '',
      perIcon: '',
      perTitle: '',
      perId: '',
      perState: '',
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  props: ['aId', 'aTitle', 'aDesc', 'aPermissions', 'aState'],
  methods: {
    expandRow() {
      // alert('hiii');
    },
    disableExpand() {
      this.$store.commit('disExpand');
      // console.log(this.$store.state.letExpand);
    },
    enableExpand() {
      this.$store.commit('enExpand');
      // console.log(this.$store.state.letExpand);
    },
    editPermision() {
      // alert(`edit premision id = ${this.perId}`);
      this.$store.commit('setWorkOn', 'access');
      this.$store.commit('openCard', this.accessId);
      this.$store.commit('setEditMode');
    },
    deleteAccess() {
      // alert(`delete premision id = ${this.accessId}`);
      this.$store.commit('setWorkOn', 'access');
      this.$store.commit('setDeleteMode', this.aTitle);
      this.$store.commit('openCard', this.accessId);
    },
    invertState() {
      // alert(`change premision state = ${this.pState}, change it to somthing`);
      let tempState = this.aState;
      this.whileState = true;
      this.perState = '○';
      let aaa = this.accessState;
      if (this.accessState) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      console.log('aaa: ', aaa);
      axios({
        method: 'put',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Accesses/${this.accessId}`,
        data: {
          title: this.aTitle,
          description: this.aDesc,
          status: tempState,
          permissionsId: this.aPermissions,
        },
      }).then((response) => {
        // console.log('active/deactive access', response);
        if (response.data.isSuccess) {
          this.whileState = false;
          this.accessState = !this.accessState;
          aaa = !aaa;
          if (aaa) {
            this.makeToast('success', 'دسترسی مورد نظر فعال شد', 2000);
          } else {
            this.makeToast('success', 'دسترسی مورد نظر غیرفعال شد', 2000);
          }
        }
      }, (error) => {
        // console.log(error);
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    init() {
      this.permissions = this.aPermissions;
      this.accessId = this.aId;
      this.accessName = this.aTitle;
      // console.log(this.accessId, this.accessName);
      // console.log(this.permissions);
      if (this.aState === 1) {
        this.accessState = true;
        // console.log('astate: ', this.aState);
      } else {
        this.accessState = false;
        // console.log('astate: ', this.aState);
      }
    },
  },
  components: {
    SwitchButton,
  },
  computed: {
    shortDesc() {
      let cdstr = this.aDesc;
      try {
        // console.log('cdstr', cdstr);
        if (cdstr.length > 55) {
          cdstr = `${cdstr.substr(0, 54)}...`;
        }
      } catch (error) {
        // console.log(error);
      }
      return cdstr;
    },
    changeAccessStatus() {
      let acState = false;
      // console.log('accessState', this.accessState);
      if (this.accessState === 1) {
        acState = true;
      } else {
        acState = false;
      }
      // console.log('hooooy', acState);
      return acState;
    },
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 20);
    // if (this.pState === 1) {
    //   this.perState = 'فعال';
    //   this.isActive = true;
    // } else {
    //   this.perState = 'غیرفعال';
    //   this.isActive = false;
    // }
  },
};
</script>

<style lang='scss' scoped>
.pRow {
  height: 88px;
  min-height: 88px;
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
}

.fullHeight{
  height: 100%;
}

.pRow:hover {
  background-color: rgba($color: #000000, $alpha: 0.02);
}

.wait {
  opacity: 0.3;
  filter: grayscale(100%);
}

.accessTitle{
  padding: 0 32px 0 8px;
  text-align: right;
}

.title{
  font-size: 14px;
}

.desc{
  font-size: 10px;
}
</style>
