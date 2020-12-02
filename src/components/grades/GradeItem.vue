<template>
  <div class='gRow fRow jBetween aCenter fullWidth'>
    <div class='tableHead title fCol aCenter jCenter'>
      <div class="gradeName">{{gTitle}}</div>
      <div class="gradeField">رشته‌ی {{gradeField}}</div>
    </div>
    <div class='tableHead itemImg'>
      <img :src="gradeImage" :alt="`تصویر ${this.gTitle}`" :title="`تصویر ${this.gTitle}`">
    </div>
    <div class='tableHead state aCenter jCenter fCol'>
      <switch-button
      @mouseover.native='disableExpand'
      @click.native="invertState"
      @mouseleave.native="enableExpand"
       :val='gradeStatus'
       :load='whileState'
       activeLabel='فعال'
       deactiveLabel='غیرفعال'/>
    </div>
    <div class='tableHead actions'>
      <i @mouseover='disableExpand'
      @click="editGrade"
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
  props: ['gTitle', 'gField', 'gFieldName', 'gStatus', 'gImg', 'gId', 'initImg'],
  data() {
    return {
      expanded: false,
      expndHeight: 0,
      gradeStatus: false,
      gradeField: '',
      gradeImage: `${this.$store.state.baseUrl}/photo/${this.gImg}`,
      whileState: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
    };
  },
  methods: {
    expandRow() {},
    disableExpand() {
      this.$store.commit('disExpand');
      // consolee.log(this.$store.state.letExpand);
    },
    enableExpand() {
      this.$store.commit('enExpand');
      // consolee.log(this.$store.state.letExpand);
    },
    editGrade() {
      // alert(`edit premision id = ${this.perId}`);
      // alert(this.gId);
      this.$store.commit('setWorkOn', 'grades');
      this.$store.commit('setGradeEditMode');
      this.$store.commit('openGradeCard', this.gId);
    },
    deletePermision() {
      // console.log(`delete premision id = ${pid}`);
      this.$store.commit('setWorkOn', 'grades');
      this.$store.commit('openGradeCard', this.gId);
      this.$store.commit('setGradeDeleteMode', `${this.gTitle} ${this.gradeField}`);
    },
    invertState() {
      // alert(`change premision state = ${this.pState}, change it to somthing`);
      let tempState = 0;
      console.log('gradeStatus', this.gradeStatus);
      this.whileState = true;
      if (this.gradeStatus) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      axios({
        method: 'put',
        url: `${this.baseURL}/api/v${this.V}/Grades/${this.gId}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          title: this.gTitle,
          photo: this.gImg,
          status: tempState,
        },
      }).then((response) => {
        this.whileState = false;
        if (response.data.isSuccess) {
          this.gradeStatus = !this.gradeStatus;
          if (this.gradeStatus) {
            this.makeToast('success', 'مجوز مورد نظر فعال شد', 2000);
          } else {
            this.makeToast('success', 'مجوز مورد نظر غیرفعال شد', 2000);
          }
        }
      }, (error) => {
        this.whileState = false;
        console.log(error);
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
  },
  components: {
    SwitchButton,
  },
  computed: {},
  mounted() {
    // console.log('has child?', this.pHasChild);
    // this.perId = this.pId;
    if (this.gStatus === 1) {
      this.gradeStatus = true;
    } else {
      this.gradeStatus = false;
    }
    switch (this.gField) {
      case 1: {
        this.gradeField = 'ریاضی و فیزیک';
        break;
      }
      case 2: {
        this.gradeField = 'علوم تجربی';
        break;
      }
      case 3: {
        this.gradeField = 'علوم انسانی';
        break;
      }
      case 4: {
        this.gradeField = 'فنی و حرفه ای';
        break;
      }
      case 5: {
        this.gradeField = 'هنر';
        break;
      }
      case 6: {
        this.gradeField = 'زبان';
        break;
      }
      default:
        break;
    }
  },
};
</script>

<style lang='scss' scoped>
.gRow {
  padding: 16px 0px;
  transition: all cubic-bezier(0.5,0,0,1) 0.5s;
  height: 100%;
}

.gradeName{
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  word-spacing: -4px;
}

.gradeField{
  font-size: 12px;
  font-weight: 100;
  margin-bottom: 8px;
  word-spacing: -2px;
}

.gRow:hover {
  background-color: rgba($color: #000000, $alpha: 0.02);
}

.wait {
  opacity: 0.3;
  filter: grayscale(100%);
}
</style>
