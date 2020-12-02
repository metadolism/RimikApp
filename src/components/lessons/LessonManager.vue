<template>
  <div class="fullWidth wrap fRow aStart jAround">
    <toast />
    <!-- card header -->
    <div class='fRow fullWidth jStart aStart'>
      <div class='growFull fCol jStart aStart'>
        <h3 class='growFull text-right'>{{ct}}</h3>
        <p class='note'>{{cd}}</p>
      </div>
    </div>
    <div class='sepLine' v-if='!this.isDelete'></div>
    <progress-bar w='100%' h='324px' msg='لطفا کمی صبر کنید'
    v-if="this.plsWait && !this.loadError"/>
    <error-bar w='100%' h='324px' :msg='msgError' v-if="!this.plsWait && this.loadError"/>
    <div class="fullWidth fRow aStart jBetween" style="margin-bottom: 16px;"
    v-if="!this.plsWait && !this.isDelete && !loadError">
      <div class="fRow jBetween aStart half wrap">
        <div class="inputWrapper fCol aStart jStart ptitle">
          <span>عنوان درس</span>
          <input v-bind:class="{err: lessonTitleError}"
          placeholder="مثلا: «ریاضی»" type="text" v-model="lessonTitle"/>
        </div>
        <div class="inputWrapper fCol aStart jStart pState">
          <span>وضعیت</span>
          <div class="fullWidth fRow aCenter jCenter switchHolder"
            @click="changeState" style="margin-top: 8px;">
            <label style="margin-left: 16px;"
            class="growFull rtlText switchLabel">وضعیت نمایش</label>
            <switch-button :val='this.lessonSwitch' activeLabel='فعال' deactiveLabel='غیرفعال'/>
          </div>
        </div>
        <div v-if="!this.plsWait"
        class="fullWidth fRow jStart aStart wrap" v-bind:class="{err: emptyError}">
          <div v-for="item in gradeArrayByField" v-bind:key="item.id"
          style="width: calc(33.3333% - 8px)" class="checkGroup">
            <label class="rContainer checkBoxHolder dark fullWidth fRow jStart aCenter">
              <input type="radio" disabled
              name="parents"
              :id='`p-${item.parentId}`'
              class="parents"
              v-on:change="ch($event, 'parent')"/>
              <span class="checkmark dark"></span>
              <span class="checkText fRow jCenter aCenter">
                <div>{{item.parent}}</div>
                <i class="material-icons-round arrow">keyboard_arrow_down</i>
              </span>
            </label>
              <!-- zirmajmooee -->
            <div class="subs fullWidth fCol jStart" >
              <label v-for="items in item.data" v-bind:key="items.index"
              class="rContainer checkBoxHolder level2 dark fullWidth fRow jStart aCenter">
                <input type="radio"
                v-on:change="ch($event, 'child')"
                class="child"
                :id='`g-${items.id}`'
                :data-id='items.id'
                :name="item.parentId"
                :data-parent='`p-${item.parentId}`'
                :data-title='items.title'
                :class="item.parentId"/>
                <span class="checkmark dark"></span>
                <span class="checkText fRow jCenter aCenter">
                  <div>{{items.title}}</div>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="fCol jStart aStart" style="min-width: 330px; margin-right: 8px;">
        <div class="imgError"
        v-if="lessonPhotoError">آپلود تصویر الزامیست</div>
        <get-photo
          w='100%'
          v-on:photoupload="getUploaded"
          photoFor='lesson'
          :initImg='this.computedInitImage'
          uploadMsg='آپلود تصویر الزامیست'
          uploadLabel='تصویر درس'/>
      </div>
    </div>
    <btn :label="this.cbl" btnWidth='70%' v-if='!this.isDelete && !this.plsWait' class="flexGrow"
    :icon="this.cbi" @click.native="mainFunction"/>
    <!-- delete -->
    <div class="fullWidth wrap aStart jStart fRow btnRow"
    v-if="!this.plsWait && this.isDelete && !this.loadError">
      <btn label="بله، حذف شود" btnWidth='auto' bc='#ff0533'
      icon="delete_sweep" @click.native="deleteLesson"/>
      <btn label="نه" btnWidth='auto' bc='#aaaaaa' icon="close" @click.native="closeModal"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Btn from '@/components/Btn.vue';
import SwitchButton from '@/components/SwitchButton.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import ErrorBar from '@/components/ErrorBar.vue';
import Toast from '@/components/Toast.vue';
import GetPhoto from '@/components/GetPhoto.vue';
import errorHandler from '@/mixins/mixin';
import makeToast from '@/mixins/makeToast';

export default {
  mixins: [errorHandler, makeToast],
  data() {
    return {
      g: 'salam',
      fields: [
        {
          label: 'ریاضی و فیزیک',
          val: 1,
        },
        {
          label: 'علوم تجربی',
          val: 2,
        },
        {
          label: 'علوم انسانی',
          val: 3,
        },
        {
          label: 'فنی حرفه‌ای',
          val: 4,
        },
        {
          label: 'هنر',
          val: 5,
        },
        {
          label: 'زبان',
          val: 6,
        },
      ],
      requestFields: [],
      gradeArrayByField: [],
      lessonTitle: '',
      gradeId: '',
      gradeIdError: false,
      lessonSwitch: true,
      lessonPhoto: '',
      lessonInitPhoto: '',
      lessonStatus: 1,
      peLocalPath: '',
      peServerPath: '',
      lessonTitleError: false,
      gradeFieldError: false,
      lessonPhotoError: false,
      peIcon: '',
      peMethod: '',
      peHasChild: false,
      peState: 0,
      loadError: false,
      emptyError: false,
      msgError: false,
      showChild: this.childSwitch,
      parentDropDown: false,
      iconDropDown: false,
      stateDropDown: false,
      methodDropDown: false,
      isDataLoad: false,
      pArray: [],
      childSwitch: false,
      titleError: false,
      iconError: false,
      ct: '',
      cd: '',
      cbl: '',
      cbi: '',
      addMode: false,
      editMode: false,
      baseURL: this.$store.state.baseUrl,
      V: this.$store.state.apiVersion,
      modalStates: this.$store.state.modalState,
      plsWait: true,
      isDelete: false,
    };
  },
  props: ['mode'],
  computed: {
    computedInitImage() {
      let cii = '';
      if (this.mode === 'add') {
        cii = 'none';
      } else if (this.mode === 'edit') {
        cii = this.lessonInitPhoto;
      }
      // alert(cii);
      return cii;
    },
  },
  methods: {
    ch(event) {
      switch (event.target.className) {
        case 'child': {
          const hameyeChildha = document.getElementsByClassName('child');
          for (let i = 0; i < hameyeChildha.length; i += 1) {
            hameyeChildha[i].checked = false;
          }
          document.getElementById(`g-${event.target.getAttribute('data-id')}`).checked = true;
          this.gradeId = event.target.getAttribute('data-id');
          console.log(this.gradeId);
          document.getElementById(event.target.getAttribute('data-parent'))
            .checked = true;
          break;
        }
        case 'parent': {
          document.getElementById(event.target.id).checked = false;
          // alert('parent');
          break;
        }
        default:
          break;
      }
    },
    initCheckBoxs(response) {
      const gParent = {};
      const gData = {};
      const riaziObject = {};
      const riazi = [];
      const tajrobiObject = {};
      const tajrobi = [];
      const ensaniObject = {};
      const ensani = [];
      const faniObject = {};
      const fani = [];
      const honarObject = {};
      const honar = [];
      const zabanObject = {};
      const zaban = [];
      // const ensani = [];
      // const fani = [];
      // const honar = [];
      // const zaban = [];
      for (let t = 0; t < response.data.data.length; t += 1) {
        gData.title = response.data.data[t].title;
        gData.id = response.data.data[t].id;
        gParent.title = '';
        switch (response.data.data[t].field) {
          case 1: {
            riazi.push(response.data.data[t]);
            break;
          }
          case 2: {
            tajrobi.push(response.data.data[t]);
            break;
          }
          case 3: {
            ensani.push(response.data.data[t]);
            break;
          }
          case 4: {
            fani.push(response.data.data[t]);
            break;
          }
          case 5: {
            honar.push(response.data.data[t]);
            break;
          }
          case 6: {
            zaban.push(response.data.data[t]);
            break;
          }
          default:
            break;
        }
      }
      riaziObject.data = riazi;
      riaziObject.parent = 'ریاضی و فیزیک';
      riaziObject.parentId = 1;
      this.gradeArrayByField.push(riaziObject);
      // -|/-\|- //
      tajrobiObject.data = tajrobi;
      tajrobiObject.parent = 'علوم تجربی';
      tajrobiObject.parentId = 2;
      this.gradeArrayByField.push(tajrobiObject);
      // -|/-\|- //
      ensaniObject.data = ensani;
      ensaniObject.parent = 'علوم انسانی';
      ensaniObject.parentId = 3;
      this.gradeArrayByField.push(ensaniObject);
      // -|/-\|- //
      faniObject.data = fani;
      faniObject.parent = 'فنی و حرفه‌ای';
      faniObject.parentId = 4;
      this.gradeArrayByField.push(faniObject);
      // -|/-\|- //
      honarObject.data = honar;
      honarObject.parent = 'هنر';
      honarObject.parentId = 5;
      this.gradeArrayByField.push(honarObject);
      // -|/-\|- //
      zabanObject.data = zaban;
      zabanObject.parent = 'زبان';
      zabanObject.parentId = 6;
      this.gradeArrayByField.push(zabanObject);
    },
    getUploaded(value) {
      this.lessonPhoto = value;
      this.lessonPhotoError = false;
    },
    selectField(event) {
      const fieldVal = parseInt(event.target.getAttribute('data-val'), 10);
      if (event.target.checked) {
        // inja bayad bbinim too add hastim ya edit
        if (this.mode === 'add') {
          if (!this.requestFields.includes(fieldVal)) {
            this.requestFields.push(fieldVal);
          }
          console.log(this.requestFields);
        } else {
          // age edit bood
          for (let i = 1; i < 7; i += 1) {
            if (i !== fieldVal) {
              document.getElementById(`check${i}`).checked = false;
            }
          }
          this.requestFields = [];
          this.requestFields.push(fieldVal);
          console.clear();
          console.log(this.requestFields);
        }
      } else {
        if (this.requestFields.includes(fieldVal)) {
          this.requestFields.splice(this.requestFields.indexOf(fieldVal), 1);
        }
        console.log(this.requestFields);
      }
    },
    getParents() {
      this.isDataLoad = false;
      this.parentDropDown = false;
      axios({
        method: 'get',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Permissions`,
      }).then((response) => {
        this.loadError = false;
        this.parentDropDown = true;
        this.posts = response.data;
        document.getElementById('parent').focus();
        if (response.data.isSuccess) {
          this.isDataLoad = true;
          this.pArray = JSON.parse(JSON.stringify(this.posts));
        }
      }, (error) => {
        // console.log(error);
        this.msgError = this.errorHandler(error);
        this.loadError = true;
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    selectParent(value) {
      this.peParentId = value;
      setTimeout(() => {
        this.parentDropDown = false;
      }, 50);
    },
    closeParent() {
      setTimeout(() => {
        this.parentDropDown = false;
      }, 160);
    },
    getIcon() {
      document.getElementById('icon').focus();
      this.iconDropDown = true;
    },
    closeIcon() {
      setTimeout(() => {
        this.iconDropDown = false;
      }, 160);
    },
    selectIcon(value) {
      this.peIcon = value;
      setTimeout(() => {
        this.iconDropDown = false;
      }, 90);
    },
    getState() {
      this.stateDropDown = true;
    },
    closeState() {
      setTimeout(() => {
        this.stateDropDown = false;
      }, 160);
    },
    selectState(value) {
      this.peState = value;
      setTimeout(() => {
        this.stateDropDown = false;
      }, 90);
    },
    getMethod() {
      document.getElementById('method').focus();
      this.methodDropDown = true;
    },
    closeMethod() {
      setTimeout(() => {
        this.methodDropDown = false;
      }, 160);
    },
    selectMethod(value) {
      this.peMethod = value;
      setTimeout(() => {
        this.methodDropDown = false;
      }, 90);
    },
    lessonDataValidate() {
      if (this.lessonTitle === '') {
        this.lessonTitleError = true;
        this.makeToast('warning', 'نام درس را وارد کنید', 2000);
        return false;
      }
      this.lessonTitleError = false;
      if (this.gradeId === '') {
        this.gradeIdError = true;
        this.makeToast('warning', 'رشته و پایه‌ی مربوطه را وارد کنید', 2000);
        return false;
      }
      this.gradeIdError = false;
      // اینجا باید تعریف کنیم اگه اینپوت عکس خالی بود نال بفرسته
      if (this.lessonPhoto === '') {
        this.lessonPhotoError = true;
        return false;
      }
      this.lessonPhotoError = false;

      console.log('lessonDataValidate');
      return true;
    },
    returnState() {
      let x = 1;
      if (!this.stateSwitch) {
        x = 2;
      }
      return x;
    },
    returnHasChild() {
      return this.childSwitch;
    },
    postLesson() {
      console.log('heey postLesson');
      if (this.lessonDataValidate()) {
        console.clear();
        console.log('lesson status', this.lessonStatus);
        axios({
          method: 'post',
          url: `${this.baseURL}/api/v${this.V}/Lessons/`,
          headers: {
            Authorization: this.$authObeject.authToken(),
          },
          data: {
            GradeId: this.gradeId,
            Title: this.lessonTitle,
            Photo: this.lessonPhoto,
            Status: this.lessonStatus,
          },
        }).then((response) => {
          // console.log('JAVAB', response);
          if (response.data.isSuccess) {
            this.$store.commit('closeCard');
            this.changeMsg();
            this.makeToast('success', 'درس مورد نظر با موفقیت اضافه شد', 2000);
          }
        }, (error) => {
          this.makeToast('error', this.errorHandler(error), 2000);
          console.log(error);
        });
      }
    },
    editLesson() {
      // consolee.log('start edit permission');
      this.lessonDataValidate();
      // console.log('child switch', this.childSwitch);
      axios({
        method: 'put',
        url: `${this.baseURL}/api/v${this.V}/Lessons/${this.$store.state.focusedLessonId}`,
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        data: {
          GradeId: this.gradeId,
          Title: this.lessonTitle,
          Photo: this.lessonPhoto,
          Status: this.lessonStatus,
        },
      }).then((response) => {
        if (response.data.isSuccess) {
          this.$store.commit('closeCard');
          this.changeMsg();
          this.makeToast('success', 'درس مورد نظر با موفقیت ویرایش شد', 2000);
        }
      }, (error) => {
        this.makeToast('success', this.errorHandler(error), 2000);
        // console.log(error);
      });
    },
    changeMsg() {
      this.$emit('changeMsg', 'hey');
      // console.log('message emit from child component');
    },
    mainFunction() {
      switch (this.mode) {
        case 'add': {
          console.log('heey');
          this.postLesson();
          break;
        }
        case 'edit': {
          this.editLesson();
          break;
        }
        default:
          break;
      }
    },
    deleteLesson() {
      axios({
        method: 'delete',
        headers: {
          Authorization: this.$authObeject.authToken(),
        },
        url: `${this.baseURL}/api/v${this.V}/Lessons/${this.$store.state.focusedLessonId}`,
      }).then((response) => {
        // console.log('delete', response);
        if (response.data.isSuccess) {
          this.$store.commit('closeCard');
          this.changeMsg();
          this.makeToast('success', 'درس مورد نظر با موفقیت حذف شد', 2000);
        }
      }, (error) => {
        // console.log(error);
        this.makeToast('error', this.errorHandler(error), 2000);
      });
    },
    closeModal() {
      this.$store.commit('closeCard');
    },
    changeState() {
      console.log('');
      this.lessonSwitch = !this.lessonSwitch;
      if (this.lessonSwitch) {
        this.lessonStatus = 1;
      } else {
        this.lessonStatus = 2;
      }
      console.log(this.lessonSwitch);
    },
    changeChildState() {
      this.childSwitch = !this.childSwitch;
      // console.log(this.childSwitch);
    },
    notAllow(inp) {
      // alert(inp);
      switch (inp) {
        case 'method': {
          this.peMethod = this.peMethod.slice(0, this.peMethod.length - 1);
          break;
        }
        case 'icon': {
          this.peIcon = this.peIcon.slice(0, this.peIcon.length - 1);
          break;
        }
        case 'parent': {
          this.peParentId = this.peParentId.slice(0, this.peParentId.length - 1);
          break;
        }
        default:
          break;
      }
    },
    init() {
      switch (this.mode) {
        case 'add': {
          this.isDelete = false;
          this.plsWait = false;
          this.ct = 'اضافه کردن درس';
          console.log('lesson manager → ', this.ct);
          this.cd = 'فرم زیر را تکمیل کنید';
          this.cbl = 'اضافه کردن درس جدید';
          this.cbi = 'add';
          this.lessonPhoto = '';
          this.addMode = true;
          this.editMode = false;
          break;
        }
        case 'edit': {
          this.isDelete = false;
          this.plsWait = true;
          this.ct = 'ویرایش درس';
          this.cd = 'اطلاعات زیر را ویرایش و ذخیره کنید';
          this.cbl = 'ثبت تغییرات';
          this.cbi = 'save';
          this.addMode = false;
          this.editMode = true;
          // گرفتن اطلاعات درس
          axios({
            method: 'get',
            headers: {
              Authorization: this.$authObeject.authToken(),
            },
            url: `${this.baseURL}/api/v${this.V}/Lessons/${this.$store.state.focusedLessonId}`,
          }).then((response) => {
            console.log('from lesson manager in edit mode →', response.data.data);
            if (response.data.isSuccess) {
              this.gradeId = response.data.data.gradeId;
              this.lessonInitPhoto = response.data.data.photo;
              this.lessonPhoto = response.data.data.photo;
              this.lessonTitle = response.data.data.title;
              this.lessonStatus = response.data.data.status;
              switch (this.lessonStatus) {
                case 1: {
                  this.lessonSwitch = true;
                  break;
                }
                case 2: {
                  this.lessonSwitch = false;
                  break;
                }
                default:
                  break;
              }
              setTimeout(() => {
                // alert(response.data.data.gradeId);
                document.getElementById(`g-${response.data.data.gradeId}`).click();
              }, 200);
              // alert(response.data.data.gradeId);
              this.plsWait = false;
            }
          }, (error) => {
            // console.log(error);
            this.plsWait = false;
            this.makeToast('error', this.errorHandler(error), 2000);
          });
          break;
        }
        case 'delete': {
          this.plsWait = false;
          this.isDelete = true;
          this.ct = `آیا از حذف درس «${this.$store.state.focusLessonName}» مطمئن هستید؟`;
          this.cd = 'این عملیات قابل بازیابی نیست.';
          break;
        }
        default:
          break;
      }
    },
  },
  components: {
    Btn,
    SwitchButton,
    ProgressBar,
    ErrorBar,
    Toast,
    GetPhoto,
  },
  mounted() {
    // گرفتن لیست گرید ها برای چک باکس
    this.plsWait = true;
    axios({
      method: 'get',
      headers: {
        Authorization: this.$authObeject.authToken(),
      },
      url: `${this.baseURL}/api/v${this.V}/Grades`,
    }).then((response) => {
      // console.log('from lesson manager in edit mode →', response.data.data);
      if (response.data.isSuccess) {
        this.init();
        this.initCheckBoxs(response);
        console.log('response az lesson manager edit',
          JSON.parse(JSON.stringify(this.gradeArrayByField)));
      }
    }, (error) => {
      // console.log(error);
      this.makeToast('error', this.errorHandler(error), 2000);
    });
  },
};
</script>

<style lang='scss' scoped>
.inputWrapper{
    margin-bottom: 24px;
    position: relative;
}
.inputWrapper span{
    font-size: 10px;
    padding-right: 8px;
    margin-bottom: 8px;
}

.inputWrapper input, .dropDownBtn{
    border: solid 2px rgba($color: #000000, $alpha: 0.2);
    border-radius: 4px;
    width: 100%;
    padding: 0px 12px;
    position: relative;
    height: 40px;
    transition: all ease-in-out 0.3s;
}

.dropDownBtn{
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.inputValue{
  font-size: 14px;
  text-align: right;
}

.inputWrapper .hide{
  opacity: 0;
  transform: scale(0);
}

.inputWrapper input:focus{
    border: solid 2px rgba($color: #000000, $alpha: 0.4);
    outline: none;
    border-radius: 8px;
    width: 100%;
    padding: 8px 12px;
}

.inputWrapper .dropDown{
    position: absolute;
    top: calc(24px - 0px);
    left: -8px;
    right: -8px;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 264px;
    background-color: white;
    box-shadow: 0 8px 32px 0 rgba($color: #000000, $alpha: 0.25);
    border-radius: 8px;
    z-index: 300;
}

.inputWrapper .err {
  border-color: red;
  color: red;
}

.inputWrapper .dropDown .item{
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 200;
    color: black;
    text-align: right;
    cursor: pointer;
    transition: all ease-in-out 0.3s;
}

.item.icon{
    width:  25% !important;
    height: 40px !important;
    display: flex;
    border-radius: 80px;
    justify-content: center;
    align-items: center;
    font-size: 24px !important;
}

.inputWrapper .dropDown .item:hover{
    background-color: rgba($color: #000000, $alpha: 0.05);
    color: #61187A;
}

.ptitle, .pParentId{
  width: 50%;
  min-width: 216px;
}

.imgError{
  border: sodlid 2px red;
  background-color: rgb(177, 15, 15);
  font-size: 14px;
  font-weight: 700;
  color: white;
  width: 100%;
  border-radius: 4px;
  text-align: right;
  padding: 8px 16px;
}

.pPath{
    width: calc(25% - 8px);
}
.pIcon{
    width: calc(25% - 8px);
}
.pState{
    width: auto
}
.pMethod{
    width: calc(25% - 8px);
}
.pHasChild{
    width: calc(60% - 8px);
}

.switchHolder{
  cursor: pointer;
}

.switchLabel{
  font-size: 12px;
  font-weight: 300;
  pointer-events: none;
}

.btnRow{
  margin-top: 16px;
}

.half {
  flex-grow: 1;
}

p.selectField{
  font-size: 14px;
  font-weight: 300;
}

</style>
