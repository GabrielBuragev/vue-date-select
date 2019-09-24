<template>
  <div class="datepicker-list-wrapper noselect">
    <ul
      class="datepicker-dropdown-list"
      :id="name + '-dropdown'"
      ref="list"
      tabindex="-1"
      v-dragscroll="dragscrollSupported"
      @scroll="!clickActive && !dragscrollActive && scrolled($event);"
      @mousedown="mousewheelTriggered"
      @touchstart="mousewheelTriggered"
      @touchmove="mousewheelTriggered"
      @dragscrollmove="onDragscrollMove"
      @dragscrollend="selectByScrollPos()"
      @mousewheel="mousewheelTriggered"
    >
      <li v-for="i in 3" :key="name + '-before-' + i"></li>
      <li
        v-for="(item,i) in items"
        :key="name + '-' + i"
        :id="name + '-'+ i"
        :class="{'focused-item': (item == selectedItem)}"
        class="item"
        data-selectable
        @click="!dragscrollActive && selectByClick(item,i,$event)"
      >
        <span>{{item}}</span>
      </li>
      <li v-for="i in 3" :key="name + '-after-' + i"></li>
    </ul>
  </div>
</template>

<script>
import { scroller } from "vue-scrollto/src/scrollTo";
import { isMobile } from "mobile-device-detect";
import { dragscroll } from "vue-dragscroll";
export default {
  directives: {
    dragscroll
  },
  props: {
    name: String,
    startingAt: Number,
    items: {
      type: Array,
      default: []
    },
    value: {
      type: [String, Number],
      default: null
    },
    valueType: {
      type: String,
      default: "value"
    },
    dropdownVisible: Boolean
  },
  data() {
    return {
      selectedItem: null,
      selectedItemIndex: null,
      selectActive: false,
      selectionActive: false,
      scroll: scroller(),
      scrollTimeout: null,
      scrollCancel: null,
      scrollSelectionTimeout: null,
      dragscrollActive: false,
      clickActive: false,
      initialize: true,
      itemHeight: 35.703,
      dragscrollSupported: isMobile ? false : true
    };
  },
  mounted() {
    var self = this;
    // Polyfill for IE9
    // this.$refs.list.addEventListener("wheel", function() {
    //   self.mousewheelTriggered();
    // });
  },
  watch: {
    dropdownVisible: function(newval, oldval) {
      if (newval && this.initialize) {
        this.scrollToElementAt(this.startingAt);
      } else if (newval && this.selectedItem && this.selectedItemIndex) {
        this.scrollToElementAt(this.selectedItemIndex);
      } else if (!newval && this.scrollCancel) {
        this.scrollCancel();
        this.scrollCancel = null;
        this.selectByScrollPos();
      }
    }
  },
  methods: {
    selectByScrollPos: function() {
      var self = this;
      var list = self.$refs.list;
      var items = document.querySelectorAll("#" + list.id + " .item");
      var fromTop = list.scrollTop + self.itemHeight / 2;
      var itemId = Math.floor(fromTop / self.itemHeight);
      var item = self.items[itemId];
      self.select(item, itemId);
    },
    selectByClick: function(item, i, $event) {
      this.initialize = false;
      this.clickActive = true;
      this.select(item, i, $event);
    },
    select: function(item, i, $event) {
      var self = this;
      // Reset everything
      self.resetTimeout();
      if (!self.dropdownVisible) return false;

      // If its first system-scroll then ignore the selection of the elements
      if (!self.initialize) {
        this.$nextTick(function() {
          self.scrollTimeout = setTimeout(function() {
            self.scrollToElementAt(i);
          }, 1);
          this.selectedItem = item;
          this.selectedItemIndex = i;
          this.$emit("input", self.valueType === "index" ? i + 1 : item);
        });
      }
    },
    scrollToElementAt: function(at) {
      var self = this;
      this.$nextTick(function() {
        var id = self.getIdForElementAt(at);

        self.scrollCancel = self.scroll(id, 300, {
          container: "#" + self.$refs.list.id,
          offset: -107.5,
          cancellable: true,
          onStart: function() {
            self.selectionActive = true;
          },
          onDone: function() {
            self.selectionActive = false;
            self.dragscrollActive = false;
            self.clickActive = false;
          },
          onCancel: function() {
            self.selectionActive = false;
            self.scrollCancel = null;
            self.dragscrollActive = false;
            self.clickActive = false;
          }
        });
      });
    },
    getIdForElementAt: function(at) {
      return "#" + this.name + "-" + at;
    },
    scrolled($evt) {
      var self = this;
      self.resetTimeout();
      if (!self.selectionActive)
        self.scrollSelectionTimeout = setTimeout(function() {
          self.selectByScrollPos();
          if (self.initialize) self.initialize = !self.initialize;
        }, 150);
    },
    onDragscrollMove(evt) {
      this.dragscrollActive = true;
    },
    clearScrollCancel() {
      if (this.scrollCancel) {
        this.scrollCancel();
        this.scrollCancel = null;
      }
    },
    mousewheelTriggered: function() {
      this.clearScrollCancel();
      // this.clickActive = false;
      this.initialize = false;
    },
    resetTimeout: function() {
      var self = this;

      if (self.scrollTimeout) {
        clearTimeout(self.scrollTimeout);
        self.scrollTimeout = null;
      }
      if (self.scrollSelectionTimeout) {
        clearTimeout(self.scrollSelectionTimeout);
        self.scrollSelectionTimeout = null;
      }
    }
  }
};
</script>