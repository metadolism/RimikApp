<template>
  <div class='gRow fRow jBetween aCenter fullWidth'>
    <div class='tableHead title fCol aCenter jCenter'>
      <div class="gradeName">{{lTitle}}</div>
      <div class="lessonGrade">{{lGradeName}} رشته {{lGradeField}}</div>
    </div>
    <div class='tableHead itemImg'>
      <img :src="lessonImage" :alt="`تصویر ${this.lTitle}`" :title="`تصویر ${this.lTitle}`">
    </div>
    <div class='tableHead state aCenter jCenter fCol'>
      <switch-button
      @mouseover.native='disableExpand'
      @click.native="invertState"
      @mouseleave.native="enableExpand"
       :val='lessonStatus'
       :load='whileState'
       activeLabel='فعال'
       deactiveLabel='غیرفعال'/>
    </div>
    <div class='tableHead actions'>
      <i @mouseover='disableExpand'
      @click="editLesson"
      @mouseleave="enableExpand" class='material-icons-round'>edit</i>
      <i @mouseover='disableExpand'
      @click="deleteLesson"
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
  props: ['lTitle', 'lGradeId', 'lGradeName', 'lGradeField', 'lStatus', 'lImg', 'lId', 'initImg'],
  data() {
    return {
      expanded: false,
      expndHeight: 0,
      lessonStatus: false,
      lessonGrade: '',
      lessonField: '',
      lessonId: this.lId,
      lessonImage: `${this.$store.state.baseUrl}/photo/${this.lImg}`,
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
    editLesson() {
      // alert(`edit premision id = ${this.perId}`);
      // alert(this.lId);
      this.$store.commit('setWorkOn', 'lessons');
      this.$store.commit('setLessonEditMode');
      this.$store.commit('openLessonCard', this.lessonId);
    },
    deleteLesson() {
      // console.log(`delete premision id = ${pid}`);
      this.$store.commit('setWorkOn', 'lessons');
      this.$store.commit('openLessonCard', this.lessonId);
      this.$store.commit('setLessonDeleteMode', `${this.lTitle} ${this.lessonGrade}`);
    },
    invertState() {
      // alert(`change premision state = ${this.pState}, change it to somthing`);
      let tempState = 0;
      console.log('lessonStatus', this.lessonStatus);
      this.whileState = true;
      if (this.lessonStatus) {
        tempState = 2;
      } else {
        tempState = 1;
      }
      console.log(`${this.lGradeId} - ${this.lTitle}
        - ${this.lImg} - ${tempState}`);
      axios({
        method: 'put',
        url: `${this.baseURL}/api/v${this.V}/Lessons/${this.lessonId}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          GradeId: this.lGradeId,
          Title: this.lTitle,
          Photo: this.lImg,
          Status: tempState,
        },
      }).then((response) => {
        this.whileState = false;
        if (response.data.isSuccess) {
          this.lessonStatus = !this.lessonStatus;
          if (this.lessonStatus) {
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
    if (this.lStatus === 1) {
      this.lessonStatus = true;
    } else {
      this.lessonStatus = false;
    }
    this.lessonId = this.lId;
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

.lessonGrade{
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
