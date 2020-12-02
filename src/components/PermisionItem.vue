<template>
  <div class='pRow fRow jBetween aCenter fullWidth'>
    <div class='tableHead title'>{{pTitle}}</div>
    <div class='tableHead icon'>
      <i class='material-icons-round'>{{pIcon}}</i>
    </div>
    <div class='tableHead path'>
        <span>{{pLocPath}}</span>
    </div>
    <div class='tableHead path'>
        <span>{{pServerPath}}</span>
    </div>
    <div class='tableHead method'>
      <span v-if="pMethod === 'GET'" class="GET">{{pMethod}}</span>
      <span v-if="pMethod === 'PUT'" class="PUT">{{pMethod}}</span>
      <span v-if="pMethod === 'POST'" class="POST">{{pMethod}}</span>
      <span v-if="pMethod === 'DELETE'" class="DELETE">{{pMethod}}</span>
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
      @mouseover.native='disableExpand'
      @click.native="invertState"
      @mouseleave.native="enableExpand"
       :val='isActive'
       activeLabel='فعال'
       deactiveLabel='غیرفعال'/>
    </div>
    <div class='tableHead actions'>
      <i @mouseover='disableExpand'
      @click="editPermision"
      @mouseleave="enableExpand" class='material-icons-round'>edit</i>
      <i @mouseover='disableExpand'
      @click="deletePermision(perId)"
      @mouseleave="enableExpand" class='material-icons-round'>clear</i>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SwitchButton from '@/components/SwitchButton.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';

export default {
  mixins: [errorHandler, makeToast],
  data() {
    return {
      expanded: false,
      expndHeight: 0,
      permissionData: [],
      pste: this.pState,
      isActive: true,
      whileState: false,
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
  props: ['pParentId', 'permission', 'pTitle', 'pIcon', 'pId', 'pLocPath', 'pServerPath', 'pState', 'pMethod', 'pHasChild'],
  methods: {
    expandRow() {
      // alert('hiii');
    },
    disableExpand() {
      this.$store.commit('disExpand');
      // consolee.log(this.$store.state.letExpand);
    },
    enableExpand() {
      this.$store.commit('enExpand');
      // consolee.log(this.$store.state.letExpand);
    },
    editPermision() {
      // alert(`edit premision id = ${this.perId}`);
      this.$store.commit('setWorkOn', 'permission');
      this.$store.commit('openCard', this.perId);
      this.$store.commit('setEditMode');
    },
    deletePermision() {
      // console.log(`delete premision id = ${pid}`);
      this.$store.commit('setWorkOn', 'permission');
      this.$store.commit('openCard', this.perId);
      this.$store.commit('setDeleteMode', this.pTitle);
    },
    invertState() {
      // alert(`change premision state = ${this.pState}, change it to somthing`);
      let tempState = this.pste;
      console.log('pste', this.pste);
      this.whileState = true;
      this.perState = '○';
      if (tempState === 1) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      axios({
        method: 'put',
        url: `${this.baseURL}/api/v${this.V}/Permissions/${this.pId}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          parentId: this.pParentId,
          title: this.pTitle,
          icon: this.pIcon,
          localPath: this.pLocPath,
          serverPath: this.pServerPath,
          method: this.pMethod,
          HasChilde: this.pHasChild,
          state: tempState,
        },
      }).then((response) => {
        console.log('JAVAB', response);
        this.whileState = false;
        this.isActive = !this.isActive;
        if (this.isActive) {
          this.perState = 'فعال';
          this.makeToast('success', 'مجوز مورد نظر فعال شد', 2000);
          this.pste = 1;
        } else {
          this.perState = 'غیرفعال';
          this.makeToast('success', 'مجوز مورد نظر غیرفعال شد', 2000);
          this.pste = 2;
        }
      }, (error) => {
        console.log(error);
        this.makeToast('error', 'خطا در تغییر وضعیت مجوز', 2000);
      });
    },
  },
  components: {
    SwitchButton,
  },
  computed: {},
  mounted() {
    // console.log('has child?', this.pHasChild);
    this.perId = this.pId;
    if (this.pState === 1) {
      this.perState = 'فعال';
      this.isActive = true;
    } else {
      this.perState = 'غیرفعال';
      this.isActive = false;
    }
  },
};
</script>

<style lang='scss' scoped>
.pRow {
  padding: 16px 0px;
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  height: 72px;
}

.pRow:hover {
  background-color: rgba($color: #000000, $alpha: 0.02);
}

.wait {
  opacity: 0.3;
  filter: grayscale(100%);
}
</style>
