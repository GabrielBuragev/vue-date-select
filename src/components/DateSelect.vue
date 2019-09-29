<template>
  <div id="datepicker-wrapper" class="datepicker-wrapper" style="position:relative;">
    <div class="datepicker-inner row">
      <div class="datepicker-input-wrapper" :class="(dropdownVisible)? 'open' : 'closed'">
        <div
          class="datepicker form-control"
          :class="{'has-error': hasError }"
          id="datepicker"
          type="text"
          @click.capture="toggleDropdownVisible"
          readonly="true"
        >
          <span class="caret"></span>
          {{datepickerValue}}
        </div>
      </div>
      <div class="datepicker-dropdowns" v-show="dropdownVisible" style="display:flex;">
        <DateSelectList
          name="days"
          :items="daysComputed"
          :startingAt="startDay - 1"
          :dropdownVisible="dropdownVisible"
          ref="daysList"
          :style="listStyles.daysList"
          v-model="value.day"
          :dragscrollEnabled="dragscroll"
        ></DateSelectList>
        <DateSelectList
          name="months"
          :items="monthsComputed"
          :startingAt="startMonth - 1"
          :dropdownVisible="dropdownVisible"
          ref="monthsList"
          :style="listStyles.monthsList"
          v-model="value.month"
          value-type="index"
          :dragscrollEnabled="dragscroll"
        ></DateSelectList>
        <DateSelectList
          name="years"
          :items="yearsComputed"
          :startingAt="startYearComputed"
          :dropdownVisible="dropdownVisible"
          ref="yearsList"
          :style="listStyles.yearsList"
          v-model="value.year"
          :dragscrollEnabled="dragscroll"
        ></DateSelectList>

        <div class="focused-liner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DateSelectList from "./DateSelectList.vue";
import months from "../assets/data/months.js";
export default {
  components: {
    DateSelectList
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        month: null,
        year: null,
        day: null
      })
    },
    dateFormat: {
      type: String,
      default: "dd.mm.yyyy"
    },
    yearRange: {
      type: [Number, Array],
      default: () => [1900, new Date().getFullYear()]
    },
    startDay: {
      type: Number,
      default: 15
    },
    startMonth: {
      type: Number,
      default: 6
    },
    startYear: {
      type: Number,
      default: 1965
    },
    locale: {
      type: String,
      default: "en_EN",
      validator: function(value) {
        return ["en_EN", "de_DE"].indexOf(value) !== -1;
      }
    },
    hasError: {
      type: Boolean,
      default: false
    },
    dragscroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dropdownVisible: false,
      slotDeterminationRegex: /^(.*)[-/.\s](.*)[-/.\s](.{0,4})$/,
      separatorDeterminationRegex: /^.*([-/.\s]).*([-/.\s]).{0,4}$/,
      defaultSeparator: ["-", "-"]
    };
  },
  watch: {
    value(nv) {
      if (nv.day && nv.month && nv.year) this.$emit("complete", nv);
    }
  },
  beforeMount() {
    if (!this.value) {
      this.$emit("input", { day: null, month: null, year: null });
    }
  },
  methods: {
    toggleDropdownVisible() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    datepickerFocused: function() {
      this.dropdownVisible = true;
    }
  },
  computed: {
    payload() {
      return {
        ...this.localSelection,
        text: datepickerValue
      };
    },
    yearsComputed: function() {
      var arr = [];
      let low = this.yearRange[0],
        high = this.yearRange[1];
      while (low <= high) arr.push(low++);

      return arr;
    },
    startYearComputed() {
      return this.yearsComputed.indexOf(this.startYear);
    },
    daysComputed: function() {
      var y = this.year,
        m = this.month;
      let mlength;
      if (m == null) mlength = 31;
      else if (m === "02")
        mlength = 28 + (!(y & 3) && (y % 100 !== 0 || !(y & 15)));
      else mlength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

      var days = [];
      while (days.length != mlength) days[days.length] = days.length + 1;
      return days;
    },
    monthsComputed() {
      return months[this.locale];
    },
    dayMasked: function() {
      if (!this.value || !this.value.day) return "DD";
      else if (this.value.day < 10) return "0" + this.value.day.toString();
      else return this.value.day;
    },
    monthMasked: function() {
      if (!this.value || !this.value.month) return "MM";
      else if (this.value.month < 10) return "0" + this.value.month.toString();
      else return this.value.month;
    },
    yearMasked: function() {
      return !this.value || !this.value.year ? "YYYY" : this.value.year;
    },
    datepickerValue: function() {
      return [
        this[this.listOrder[0] + "Masked"],
        this.separators[0],
        this[this.listOrder[1] + "Masked"],
        this.separators[1],
        this[this.listOrder[2] + "Masked"]
      ].join("");
    },
    listStyles() {
      return {
        daysList: {
          order: this.listOrder.indexOf("day") + 1
        },
        monthsList: {
          order: this.listOrder.indexOf("month") + 1
        },
        yearsList: {
          order: this.listOrder.indexOf("year") + 1
        }
      };
    },
    listOrder() {
      let slots = new RegExp(this.slotDeterminationRegex).exec(this.dateFormat);
      let order;
      if (slots) {
        slots = slots.slice(1, 4);
        order = {
          days: slots.indexOf("dd"),
          months: slots.indexOf("mm"),
          years: slots.indexOf("yyyy")
        };
      }
      let arr = [];
      arr[order.days + "" || 0] = "day";
      arr[order.months + "" || 1] = "month";
      arr[order.years + "" || 2] = "year";

      return arr;
    },
    separators() {
      let separators = new RegExp(this.separatorDeterminationRegex).exec(
        this.dateFormat
      );
      if (separators) {
        return separators.slice(1, 3);
      }
      return this.defaultSeparator;
    }
  }
};
</script>
