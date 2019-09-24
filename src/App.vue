<template>
  <div id="app">
    <DateSelect
      v-model="date"
      dateFormat="mm.dd.yyyy"
      :yearRange="[1990, 2019]"
      :startDay="1"
      :startMonth="6"
      :startYear="1990"
      locale="de_DE"
    ></DateSelect>
  </div>
</template>

<script>
import DateSelect from "./components/DateSelect.vue";
import * as whatever from "../dist/vue-dateselect.umd";
console.log(whatever);
export default {
  name: "app",
  components: {
    DateSelect
  },
  data() {
    return {
      date: {}
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 30px;
}
html {
  background-color: gray;
}
</style>
