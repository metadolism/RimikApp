<template>
  <div class="videoItem fullWidth fCol jStart aCenter">
    <div class="badgeBox fCol jStart aEnd">
      <div class="badge">رایگان</div>
      <div class="badge">دمو</div>
      <div class="badge">غیرفعال</div>
    </div>
    <video ref="previewFrame" v-if="videoCanPlay">
      <source src="../assets/vid.mp4"
        type="video/mp4"/>
        <div class="over"></div>
      Your browser does not support the video tag.
    </video>
    <div class="fRow jStart aStart titleHolder fullWidth inp">
      <!-- <i class="material-icons-round">duo</i> -->
      <textarea type="text" v-model='videoTitle' placeholder="عنوان ویدئو را وارد کنید"></textarea>
      <btn label='ثبت' fabBtn='true' class="saveBtn" v-bind:class="{show: this.showSaveBtn}"
        bc='#60a930' icon='save'/>
    </div>
    <div class="fRow fullWidth jBetween aCenter">
      <div class="inputWrapper fCol aCenter jStart w33">
        <span class="switchHead">وضعیت</span>
        <switch-button activeLabel="فعال" deactiveLabel="غیرفعال"
          :val="this.statusSwitch" @click.native="toggleValue('status')" />
      </div>
      <div class="inputWrapper fCol aCenter jStart w33">
        <span class="switchHead">رایگان</span>
        <switch-button activeLabel="رایگان" deactiveLabel="رایگان"
          :val="this.stateSwitch" @click.native="toggleValue('state')" />
      </div>
      <div class="inputWrapper fCol aCenter jStart w33">
        <span class="switchHead">دمو</span>
        <switch-button activeLabel="دمو" deactiveLabel="دمو"
          :val="this.isPreviewSwitch" @click.native="toggleValue('preview')" />
      </div>
    </div>
  </div>
</template>

<script>
import SwitchButton from '@/components/SwitchButton.vue';
import Btn from '@/components/Btn.vue';

export default {
  data() {
    return {
      videoCanPlay: false,
      h: 0,
      w: 0,
      videoTitle: 'عنوان ویدئو برای نمایش',
      title: 'عنوان ویدئو برای نمایش',
      statusSwitch: false,
      stateSwitch: true,
      isPreviewSwitch: false,
      showSaveBtn: false,
    };
  },
  computed: {
    computedHeight() {
      return this.$refs.previewFrame.clientWidth;
    },
  },
  methods: {
    showVideo() {
      this.videoCanPlay = true;
      // alert('hey');
    },
    titleChange() {
      if (this.videoTitle !== this.title) {
        this.showSaveBtn = true;
      } else {
        console.log('نشون نده');
        this.showSaveBtn = false;
      }
    },
  },
  watch: {
    videoTitle() {
      console.log(this.videoTitle);
      this.titleChange();
    },
  },
  components: {
    Btn,
    SwitchButton,
  },
  mounted() {
    setTimeout(() => {
      this.videoCanPlay = true;
    }, 10);
  },
};
</script>

<style lang="scss" scoped>
.videoItem{
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 0 0 24px 0;
  box-shadow: 0 8px 16px 0 rgba($color: #000000, $alpha: 0.0);
  border: solid 1px rgba($color: #000000, $alpha: 0.1)
}

.videoItem .badgeBox{
  position: absolute;
  top: 8px;
  left: 0px;
}

.badgeBox .badge{
  margin-bottom: 0px;
  padding: 4px 8px;
  height: 24px;
  background-position: left center;
  background-image: url('../assets/badge.svg');
  background-repeat: no-repeat;
  background-size: 100%;
  color: white;
  font-size: 10px;
  font-weight: 100;
  z-index: 20000;
}
.videoItem video{
  position: relative;
  width: 100%;
  z-index: 100;
}

.videoItem video .over{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: aliceblue;
}

video:focus {
  outline: none;
}
.titleHolder{
  padding: 12px;
}
.titleHolder textarea{
  font-size: 14px;
  text-align: right;
  margin: 0 0px 0 8px;
  padding: 4px 8px;
  min-height: 64px;
  border: none;
  resize: none;
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
  flex-grow: 1;
}
.titleHolder textarea:focus{
  outline: none;
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.6);
}

.switchHead{
  font-size: 12px;
  margin: 8px 0 8px;
}
.saveBtn{
  pointer-events: none;
  opacity: 0.2;
}

.saveBtn.show{
  pointer-events: unset;
  opacity: 1;
}

.inp{
  box-shadow: 0 -64px 64px 0 rgba($color: #ffffff, $alpha: 0.6);
  z-index: 200;
}
</style>
