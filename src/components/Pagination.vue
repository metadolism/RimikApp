<template>
  <div class="pagination fCol jCenter aCenter fullWidth">
    <div class="choosePageSize fullWidth fRow jCenter aCenter">
      <label>تعداد آیتم هر صفحه: </label>
      <div class="drDoBox fRow jCenter aCenter transition-fast">
        <i class="material-icons-round">keyboard_arrow_down</i>
        <span>{{selectedPageSize}} آیتم</span>
        <div class="pList transition-fast">
          <div class="li transition-fast" @click="resetPageSize(5)">5 آیتم</div>
          <div class="li transition-fast" @click="resetPageSize(10)">10 آیتم</div>
          <div class="li transition-fast" @click="resetPageSize(20)">20 آیتم</div>
          <div class="li transition-fast" @click="resetPageSize(40)">40 آیتم</div>
        </div>
      </div>
    </div>
    <div class="fullWidth jCenter aCenter fRow">
      <i class="material-icons-round" v-bind:class="{hide: this.pages < 2}"
        @click="goToPage($event, 'prev')">keyboard_arrow_right</i>
      <div class="page fRow aCenter jCenter"
        v-for="item in pagesArray" :id='`p${item}`'
        v-bind:key="item" @click="goToPage($event, item)">{{item}}</div>
      <i class="material-icons-round" v-bind:class="{hide: this.pages < 2}"
        @click="goToPage($event, 'next')">keyboard_arrow_left</i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagesArray: [],
      selectedPageSize: 5,
    };
  },
  methods: {
    goToPage(e, x) {
      if (x === 'next') {
        this.$emit('goToPage', 'next');
      } else if (x === 'prev') {
        this.$emit('goToPage', 'prev');
      } else {
        const allPs = document.getElementsByClassName('page');
        for (let i = 0; i < allPs; i += 1) {
          allPs[i].classList.remove('selected');
        }
        e.target.classList.add('selected');
        this.$emit('goToPage', x);
      }
    },
    resetPageSize(pageSize) {
      this.selectedPageSize = pageSize;
      this.$emit('resetPageSize', pageSize);
    },
  },
  props: ['pages', 'active', 'psize'],
  mounted() {
    this.selectedPageSize = this.psize;
    this.pagesArray = [];
    for (let i = 1; i <= this.pages; i += 1) {
      this.pagesArray.push(i);
    }
    setTimeout(() => {
      if (this.pages > 0) {
        document.getElementById(`p${this.active}`).classList.add('selected');
      }
    }, 10);
  },
};
</script>

<style lang="scss" scoped>
.choosePageSize{
  margin-bottom: 8px;
}

.choosePageSize label{
  font-size: 10px;
  margin-left: 8px;
}

.drDoBox{
  position: relative;
  border-radius: 8px;
  padding: 4px 8px;
  min-width: 84px;
  background-color: rgba($color: #eeeeee, $alpha: 1);
}

.drDoBox:hover{
  border-radius: 8px 8px 0 0;
}

.drDoBox span{
  font-size: 12px;
  font-weight: 500;
  margin-right: 4px;
  flex-grow: 1;
  text-align: right;
}

.drDoBox i{
  font-size: 12px;
}
.drDoBox .pList{
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 200;
  height: auto;
  transform-origin: top center;
  transform: scaleY(0);
  background-color: rgba($color: #d8d8d8, $alpha: 1);
  box-shadow: 0 8px 8px 0 rgba($color: #000000, $alpha: 0.1);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.pList .li{
  padding: 8px 8px;
  text-align: right;
  font-size: 12px;
  font-weight: bold;
}

.pList .li:hover{
  background-color: rgba(255, 255, 255, 0.486);
}

.drDoBox:hover .pList{
  transform: scaleY(1);
}
.pagination{
  margin-top: 24px;
  padding-top: 24px;
  border-top: dashed 1px rgba($color: #000000, $alpha: 0.1);
}
  $ww: 24px;
  $wws: 32px;
  .page{
    width: $ww;
    height: $ww;
    border-radius: 84px;
    background-color: rgb(235, 235, 235);
    color: #333333;
    margin: 0 4px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: all ease-in-out 0.3s, width linear 0, height linear 0;
  }

  .page:hover{
    background-color: rgb(199, 199, 199);
    color: #333333;
  }

  .page.selected{
    width: $wws;
    height: $wws;
    pointer-events: none;
    background-color: rgb(83, 25, 131);
    color: #ffffff;
  }

  .pagination i{
    color: rgba($color: #000000, $alpha: 0.3);
    transition: all ease-in-out 0.3s;
  }

  .pagination i:hover{
    color: rgba($color: #000000, $alpha: 1);
  }

  .hide{
    opacity: 0.2;
    pointer-events: none;
  }
</style>
